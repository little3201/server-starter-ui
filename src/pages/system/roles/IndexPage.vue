<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules, TreeInstance, CheckboxValueType } from 'element-plus'
import type { InternalRuleItem } from 'async-validator/dist-types/interface'
import draggable from 'vuedraggable'
import { useI18n } from 'vue-i18n'
import DialogView from 'components/DialogView.vue'
import {
  retrieveRoles, retrieveRoleMembers, retrieveRolePrivileges, relationRolePrivileges,
  removeRolePrivileges, fetchRole, createRole, modifyRole, removeRole, enableRole, checkRoleExists
} from 'src/api/roles'
import { retrievePrivilegeTree } from 'src/api/privileges'
import { retrieveUsers } from 'src/api/users'
import type { Pagination, Role, RoleMembers, RolePrivileges, PrivilegeTreeNode, User } from 'src/types'
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'


const { t, locale } = useI18n()
const loading = ref<boolean>(false)
const datas = ref<Array<Role>>([])
const total = ref<number>(0)

const pagination = reactive<Pagination>({
  page: 1,
  size: 10
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'enabled', 'description'])
const columns = ref<Array<string>>(['name', 'enabled', 'description'])

const treeEl = ref<TreeInstance>()
const privilegeTreeLoading = ref<boolean>(false)
const privilegeTree = ref<Array<PrivilegeTreeNode>>([])
const rolePrivileges = ref<Array<number>>([])

const saveLoading = ref<boolean>(false)
const visible = ref<boolean>(false)

const relationVisible = ref<boolean>(false)
const selectedRow = ref<Role>({
  id: undefined,
  name: ''
})
const members = ref([])

const filters = ref({
  name: null
})

const formRef = ref<FormInstance>()
const initialValues: Role = {
  id: undefined,
  name: ''
}
const form = ref<Role>({ ...initialValues })

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, message: t('inputText', { field: t('name') }), trigger: 'blur' },
    { validator: checkNameExistsence, trigger: 'blur' }
  ]
})

function checkNameExistsence(rule: InternalRuleItem, value: string, callback: (error?: string | Error) => void) {
  checkRoleExists(value, form.value.id).then(res => {
    if (res.data) {
      callback(new Error(t('alreadyExists', { field: t('name') })))
    } else {
      callback()
    }
  })
}

const dataPrivilege = ref<number>(0)
const relations = ref<Array<string>>([])

// const checkedActions = ref<Array<number>>([])

async function loadUsers() {
  retrieveUsers({ page: 1, size: 99 }).then(res => {
    members.value = res.data.content.map((item: User) => ({
      ...item,
      fullName: (locale.value === 'en-US' || item.middleName !== null) ? `${item.givenName} ${item.middleName} ${item.familyName}` : `${item.familyName}${item.givenName}`
    }))
  })
}

async function loadRoleUsers(id: number) {
  retrieveRoleMembers(id).then(res => { relations.value = res.data.map((item: RoleMembers) => item.username) })
}

function transformTree(tree: PrivilegeTreeNode[]): PrivilegeTreeNode[] {
  return tree.map(node => {
    // 判断条件并处理
    let isPenultimate = false
    if (node.meta.actions && !node.children) {
      isPenultimate = true
      node.children = node.meta.actions.map(action => ({
        id: `${node.name}:${action}`,
        name: action,
        meta: {
          path: '',
          component: '',
          icon: '',
          redirect: '',
        }
      }))
    }

    return {
      ...node,
      isPenultimate: isPenultimate,
      children: node.children ? transformTree(node.children) : undefined
    }
  })
}

/**
 * 权限树
 */
async function loadPrivilegeTree() {
  privilegeTreeLoading.value = true
  retrievePrivilegeTree().then(res => {
    privilegeTree.value = transformTree(res.data)
  }).finally(() => { privilegeTreeLoading.value = false })
}

/**
 * 分页变化
 * @param currentPage 当前页码
 * @param pageSize 分页大小
 */
function pageChange(currentPage: number, pageSize: number) {
  pagination.page = currentPage
  pagination.size = pageSize
  load()
}

/**
 * 加载列表
 */
async function load() {
  loading.value = true
  retrieveRoles(pagination, filters.value).then(res => {
    datas.value = res.data.content
    total.value = res.data.page.totalElements
  }).finally(() => { loading.value = false })
}

/**
 * reset
 */
function reset() {
  filters.value = {
    name: null
  }
  load()
}

onMounted(() => {
  load()
  loadPrivilegeTree()
})

/**
 * 关联弹出框
 * @param id 主键
 */
function relationRow(id: number) {
  relationVisible.value = true
  loadUsers()
  loadRoleUsers(id)
}

/**
 * 新增、编辑弹出框
 * @param id 主键
 */
function saveRow(id?: number) {
  form.value = { ...initialValues }
  if (id) {
    loadOne(id)
  }
  visible.value = true
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  fetchRole(id).then(res => {
    form.value = res.data
  })
}

/**
 * 启用、停用
 * @param id 主键
 */
async function enableChange(id: number) {
  enableRole(id).then(() => { load() })
}

/**
 * 表单提交
 */
function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      saveLoading.value = true
      if (form.value.id) {
        modifyRole(form.value.id, form.value).then(() => {
          load()
          visible.value = false
        }).finally(() => { saveLoading.value = false })
      } else {
        createRole(form.value).then(() => {
          load()
          visible.value = false
        }).finally(() => { saveLoading.value = false })
      }
    }
  })
}

/**
 * 删除
 * @param id 主键
 */
function removeRow(id: number) {
  removeRole(id)
    .then(() => load())
}

/**
 * 确认
 * @param id 主键
 */
function confirmEvent(id: number) {
  if (id) {
    removeRow(id)
  }
}

/**
 * privilete tree check
 */
function handlePrivilegeCheckChange(data: PrivilegeTreeNode, checked: boolean) {
  const ids = []
  if (data.id && selectedRow.value && selectedRow.value.id) {
    ids.push(data.id)
    if (checked) {
      relationRolePrivileges(selectedRow.value.id, ids)
    } else {
      removeRolePrivileges(selectedRow.value.id, ids)
    }
  }

}

/**
 * 行选择操作
 * @param val 选中行
 */
function handleCurrentChange(row: Role | undefined) {
  if (row && row.id) {
    treeEl.value!.setCheckedKeys([])
    selectedRow.value = row
    retrieveRolePrivileges(row.id).then(res => {
      rolePrivileges.value = res.data.map((item: RolePrivileges) => item.privilegeId)
    })
  }
}

/**
 * 全选操作
 * @param val 是否全选
 */
function handleCheckAllChange(val: CheckboxValueType) {
  checkedColumns.value = val ? columns.value : []
  isIndeterminate.value = false
}

/**
 * 选中操作
 * @param value 选中的值
 */
function handleCheckedChange(value: string[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === columns.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columns.value.length
}

function customNodeClass({ isPenultimate }: TreeNodeData) {
  return isPenultimate ? 'is-penultimate' : ''
}
</script>

<template>
  <ElSpace size="large" fill>
    <ElCard shadow="never">
      <ElForm inline :model="filters" @submit.prevent>
        <ElFormItem :label="$t('name')" prop="name">
          <ElInput v-model="filters.name" :placeholder="$t('inputText', { field: $t('name') })" />
        </ElFormItem>
        <ElFormItem>
          <ElButton title="search" type="primary" @click="load">
            <div class="i-material-symbols:search-rounded" />{{ $t('search') }}
          </ElButton>
          <ElButton title="reset" @click="reset">
            <div class="i-material-symbols:replay-rounded" />{{ $t('reset') }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElRow :gutter="16">
      <ElCol :span="16">
        <ElCard shadow="never">
          <ElRow :gutter="20" justify="space-between" class="mb-4">
            <ElCol :span="16" class="text-left">
              <ElButton title="create" type="primary" @click="saveRow()">
                <div class="i-material-symbols:add-rounded" />{{ $t('create') }}
              </ElButton>
              <ElButton title="import" type="warning" plain @click="visible = true">
                <div class="i-material-symbols:database-upload-outline-rounded" />{{ $t('import') }}
              </ElButton>
              <ElButton title="export" type="success" plain>
                <div class="i-material-symbols:file-export-outline-rounded" />{{ $t('export') }}
              </ElButton>
            </ElCol>

            <ElCol :span="8" class="text-right">
              <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
                <ElButton title="refresh" type="primary" plain circle @click="load">
                  <div class="i-material-symbols:refresh-rounded" />
                </ElButton>
              </ElTooltip>

              <ElTooltip :content="$t('column') + $t('settings')" placement="top">
                <span class="inline-block ml-3 h-8">
                  <ElPopover :width="200" trigger="click">
                    <template #reference>
                      <ElButton title="settings" type="success" plain circle>
                        <div class="i-material-symbols:format-list-bulleted" />
                      </ElButton>
                    </template>
                    <div>
                      <ElCheckbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                        {{ $t('all') }}
                      </ElCheckbox>
                      <ElDivider />
                      <ElCheckboxGroup v-model="checkedColumns" @change="handleCheckedChange">
                        <draggable v-model="columns" item-key="simple">
                          <template #item="{ element }">
                            <div class="flex items-center space-x-2">
                              <div class="i-material-symbols:drag-indicator w-4 h-4 hover:cursor-move" />
                              <ElCheckbox :label="element" :value="element" :disabled="element === columns[0]">
                                <div class="inline-flex items-center space-x-4">
                                  {{ $t(element) }}
                                </div>
                              </ElCheckbox>
                            </div>
                          </template>
                        </draggable>
                      </ElCheckboxGroup>
                    </div>
                  </ElPopover>
                </span>
              </ElTooltip>
            </ElCol>
          </ElRow>

          <ElTable v-loading="loading" :data="datas" row-key="id" stripe table-layout="auto" highlight-current-row
            @current-change="handleCurrentChange">
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn type="index" :label="$t('no')" width="55" />
            <ElTableColumn prop="name" :label="$t('name')" />
            <ElTableColumn prop="enabled" :label="$t('enabled')">
              <template #default="scope">
                <ElSwitch size="small" v-model="scope.row.enabled" @change="enableChange(scope.row.id)"
                  style="--el-switch-on-color: var(--el-color-success);" />
              </template>
            </ElTableColumn>
            <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
            <ElTableColumn :label="$t('actions')">
              <template #default="scope">
                <ElButton title="modify" size="small" type="primary" link @click="saveRow(scope.row.id)">
                  <div class="i-material-symbols:edit-outline-rounded" />{{ $t('modify') }}
                </ElButton>
                <ElButton title="relation" size="small" type="success" link @click="relationRow(scope.row.id)">
                  <div class="i-material-symbols:link-rounded" />{{ $t('relation') }}
                </ElButton>
                <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
                  <template #reference>
                    <ElButton title="remove" size="small" type="danger" link>
                      <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
                    </ElButton>
                  </template>
                </ElPopconfirm>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange" :total="total" />
        </ElCard>
      </ElCol>
      <ElCol :span="8">
        <ElCard shadow="never" class="h-full">
          <ElTabs stretch>
            <ElTabPane :label="$t('actions') + $t('privileges')">
              <ElTree ref="treeEl" v-loading="privilegeTreeLoading" :data="privilegeTree" :expand-on-click-node="false"
                node-key="id" :props="{ label: 'name', class: customNodeClass }" show-checkbox
                @check="handlePrivilegeCheckChange" :default-checked-keys="rolePrivileges">
                <template #default="{ node, data }">
                  <div class="inline-flex items-center">
                    <div :class="`i-material-symbols:${data.meta.icon}`" />
                    <span class="ml-2">{{ $t(node.label) }}</span>
                  </div>
                </template>
              </ElTree>
            </ElTabPane>
            <ElTabPane :label="$t('data') + $t('privileges')">
              <ElSelect v-model="dataPrivilege" class="mb-3">
                <ElOption :value="0" :label="$t('all')" />
                <ElOption :value="1" :label="$t('yourself')" />
                <ElOption :value="2" :label="$t('yourGroup')" />
                <ElOption :value="3" :label="$t('custom')" />
              </ElSelect>
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </ElCol>
    </ElRow>
  </ElSpace>

  <DialogView v-model="visible" :title="$t('roles')" width="25%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol>
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="form.name" :placeholder="$t('inputText', { field: $t('name') })" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol>
          <ElFormItem :label="$t('description')" prop="description">
            <ElInput v-model="form.description" type="textarea"
              :placeholder="$t('inputText', { field: $t('description') })" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton title="cancel" @click="visible = false">
        <div class="i-material-symbols:close" />{{ $t('cancel') }}
      </ElButton>
      <ElButton title="submit" type="primary" :loading="saveLoading" @click="onSubmit(formRef)">
        <div class="i-material-symbols:check-circle-outline-rounded" /> {{ $t('submit') }}
      </ElButton>
    </template>
  </DialogView>

  <DialogView v-model="relationVisible" show-close :title="$t('relation')">
    <div style="text-align: center">
      <ElTransfer v-model="relations" :props="{ key: 'username', label: 'fullName' }"
        :titles="[$t('unselected'), $t('selected')]" filterable :data="members" />
    </div>
  </DialogView>
</template>

<style lang="scss" scoped>
.is-penultimate {
  .el-tree-node__children {
    display: inline-block;
  }
}
</style>