<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules, TreeInstance } from 'element-plus'
import draggable from 'vuedraggable'
import Dialog from 'components/Dialog.vue'
import { retrieveGroups, retrieveGroupMembers, retrieveGroupTree, fetchGroup, createGroup, modifyGroup, removeGroup } from 'src/api/groups'
import { retrieveUsers } from 'src/api/users'
import type { Pagination, Group, TreeNode, GroupMembers } from 'src/models'


const loading = ref<boolean>(false)
const datas = ref<Array<Group>>([])
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
const treeLoading = ref<boolean>(false)
const currentNodeKey = ref<number>()
const currentNode = ref('')

const groupTree = ref<TreeNode[]>([])
const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const relationVisible = ref<boolean>(false)
const members = ref([])

const filters = ref({
  superiorId: null as number | null,
  name: null
})

const formRef = ref<FormInstance>()
const initialValues: Group = {
  name: '',
  enabled: true,
  description: ''
}
const form = ref<Group>({ ...initialValues })

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ]
})

const relations = ref<Array<string>>([])

/**
 * tree过滤
 */
const filterNode = (value: string, data: TreeNode) => {
  if (!value) return true
  return data.name.includes(value)
}

/**
 * node 变化
 * @param data node节点
 */
function currentChange(data: TreeNode) {
  if (currentNodeKey.value === data.id) {
    return
  }
  currentNodeKey.value = data.id
  pagination.page = 1
  load()
}

async function loadUsers() {
  retrieveUsers({ page: 1, size: 99 }).then(res => members.value = res.data.content)
}

async function loadGroupUsers(id: number) {
  retrieveGroupMembers(id).then(res => relations.value = res.data.map((item: GroupMembers) => item.username))
}

/**
 * 加载tree
 */
async function loadTree() {
  treeLoading.value = true
  retrieveGroupTree().then(res => {
    groupTree.value = res.data
    if (!currentNodeKey.value) {
      currentNodeKey.value = (res.data[0] && res.data[0]?.id) || ''
    }

    treeEl.value!.setCurrentKey(currentNodeKey.value)

    load()
  }).finally(() => treeLoading.value = false)
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
  filters.value.superiorId = currentNodeKey.value ?? null
  retrieveGroups(pagination, filters.value).then(res => {
    datas.value = res.data.content
    total.value = res.data.page.totalElements
  }).finally(() => loading.value = false)
}

/**
 * reset
 */
function reset() {
  filters.value.name = null
  load()
}

/**
 * 监听tree
 */
watch(
  () => currentNode.value,
  (val) => {
    treeEl.value!.filter(val)
  }
)

onMounted(() => {
  loadTree()
})

/**
 * 关联弹出框
 * @param id 主键
 */
function relationRow(id: number) {
  relationVisible.value = true
  loadUsers()
  loadGroupUsers(id)
}

/**
 * 新增、编辑弹出框
 * @param id 主键
 */
function editRow(id?: number) {
  form.value = { ...initialValues }
  if (id) {
    loadOne(id)
  }
  dialogVisible.value = true
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  fetchGroup(id).then(res => {
    form.value = res.data
  })
}

/**
 * 表单提交
 */
function onSubmit() {
  let formEl = formRef.value
  if (!formEl) return

  formEl.validate((valid, fields) => {
    if (valid) {
      saveLoading.value = true
      if (form.value.id) {
        modifyGroup(form.value.id, form.value).then(() => {
          load()
          loadTree()
          dialogVisible.value = false
        }).finally(() => saveLoading.value = false)
      } else {
        form.value.superiorId = currentNodeKey.value
        createGroup(form.value).then(() => {
          load()
          loadTree()
          dialogVisible.value = false
        }).finally(() => saveLoading.value = false)
      }
    }
  })
}

/**
 * 删除
 * @param id 主键
 */
function removeRow(id: number) {
  removeGroup(id).then(() => {
    load()
    loadTree()
  })
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
 * 全选操作
 * @param val 是否全选
 */
function handleCheckAllChange(val: boolean) {
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
</script>

<template>
  <div class="flex justify-between space-x-4">
    <ElCard class="w-64 flex-shrink-0" shadow="never">
      <ElFormItem prop="currentNode">
        <ElInput v-model="currentNode" :placeholder="$t('search')" clearable>
          <template #prefix>
            <div class="i-material-symbols:search-rounded" />
          </template>
        </ElInput>
      </ElFormItem>
      <ElDivider />
      <ElTree ref="treeEl" v-loading="treeLoading" :data="groupTree" default-expand-all :expand-on-click-node="false"
        node-key="id" :current-node-key="currentNodeKey" :props="{ label: 'name' }" :filter-node-method="filterNode"
        @current-change="currentChange">
      </ElTree>
    </ElCard>

    <div class="w-full">
      <ElSpace size="large" fill>
        <ElCard shadow="never">
          <ElForm inline :model="filters" @submit.prevent>
            <ElFormItem :label="$t('name')" prop="name">
              <ElInput v-model="filters.name" :placeholder="$t('inputText') + $t('name')" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary" @click="load">
                <div class="i-material-symbols:search-rounded" />{{ $t('search') }}
              </ElButton>
              <ElButton @click="reset">
                <div class="i-material-symbols:replay-rounded" />{{ $t('reset') }}
              </ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <ElCard shadow="never">
          <ElRow :gutter="20" justify="space-between" class="mb-4">
            <ElCol :span="16" class="text-left">
              <ElButton type="primary" @click="editRow()">
                <div class="i-material-symbols:add-rounded" />{{ $t('add') }}
              </ElButton>
              <ElButton type="warning" plain @click="dialogVisible = true">
                <div class="i-material-symbols:upload-file-outline-rounded" />{{ $t('import') }}
              </ElButton>
              <ElButton type="success" plain>
                <div class="i-material-symbols:file-save-outline-rounded" />{{ $t('export') }}
              </ElButton>
            </ElCol>

            <ElCol :span="8" class="text-right">
              <ElTooltip :content="$t('refresh')" placement="top">
                <ElButton type="primary" plain circle @click="load">
                  <div class="i-material-symbols:refresh-rounded" />
                </ElButton>
              </ElTooltip>

              <ElTooltip :content="$t('column') + $t('settings')" placement="top">
                <span class="inline-block ml-3 h-8">
                  <ElPopover :width="200" trigger="click">
                    <template #reference>
                      <ElButton type="success" plain circle>
                        <div class="i-material-symbols:format-list-bulleted" />
                      </ElButton>
                    </template>
                    <div>
                      <ElCheckbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                        全选
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

          <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto">
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn type="index" :label="$t('no')" width="55" />
            <ElTableColumn prop="name" :label="$t('name')" />
            <ElTableColumn prop="enabled" :label="$t('enabled')">
              <template #default="scope">
                <ElSwitch size="small" v-model="scope.row.enabled"
                  style="--el-switch-on-color: var(--el-color-success);" />
              </template>
            </ElTableColumn>
            <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
            <ElTableColumn :label="$t('actions')">
              <template #default="scope">
                <ElButton size="small" type="success" link @click="relationRow(scope.row.id)">
                  <div class="i-material-symbols:link-rounded" />{{ $t('relation') }}
                </ElButton>
                <ElButton size="small" type="primary" link @click="editRow(scope.row.id)">
                  <div class="i-material-symbols:edit-outline-rounded" />{{ $t('edit') }}
                </ElButton>
                <ElPopconfirm v-if="!scope.row.hasChildren" :title="$t('removeConfirm')" :width="240"
                  @confirm="confirmEvent(scope.row.id)">
                  <template #reference>
                    <ElButton size="small" type="danger" link>
                      <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
                    </ElButton>
                  </template>
                </ElPopconfirm>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange" :total="total" />
        </ElCard>
      </ElSpace>
    </div>
  </div>

  <Dialog v-model="dialogVisible" :title="$t('groups')" width="25%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol>
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="form.name" :placeholder="$t('inputText') + $t('name')" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol>
          <ElFormItem :label="$t('description')" prop="description">
            <ElInput v-model="form.description" type="textarea" :placeholder="$t('inputText') + $t('description')" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">
        <div class="i-material-symbols:close" />{{ $t('cancel') }}
      </ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
        <div class="i-material-symbols:check-circle-outline-rounded" /> {{ $t('submit') }}
      </ElButton>
    </template>
  </Dialog>

  <Dialog v-model="relationVisible" :title="$t('relation')">
    <div style="text-align: center">
      <ElTransfer v-model="relations" :props="{ key: 'username', label: 'fullName' }"
        :titles="[$t('unselected'), $t('selected')]" filterable :data="members" />
    </div>
  </Dialog>
</template>
