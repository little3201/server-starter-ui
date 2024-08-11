<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrieveRoles, retrieveRolePrivileges, retrieveRoleDepartments, fetchRole } from '~/api/roles'
import { retrievePrivilegeTree } from '~/api/privileges'
import { retrieveDepartmentTree } from '~/api/organizations'
import type { Role, TreeNode } from '~/models'

const loading = ref<boolean>(false)
const datas = ref<Array<Role>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const privilegeTreeLoading = ref<boolean>(false)
const privilegeTree = ref<Array<Number>>([])
const rolePrivileges = ref<Array<TreeNode>>([])

const organizationTreeLoading = ref<boolean>(false)
const organizationTree = ref<Array<TreeNode>>([])
const roleDepartments = ref<Array<Number>>([])

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const searchForm = ref({
  name: null
})

const formRef = ref<FormInstance>()
const form = ref<Role>({
  name: '',
  privilege: undefined,
  description: ''
})

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ]
})

const dataPrivilege = ref<number>(1)

/**
 * 权限树
 */
function loadPrivilegeTree() {
  privilegeTreeLoading.value = true
  retrievePrivilegeTree().then(res => {
    privilegeTree.value = res.data
  }).finally(() => privilegeTreeLoading.value = false)
}

/**
 * 组织树
 */
function loadDepartmentTree() {
  organizationTreeLoading.value = true
  retrieveDepartmentTree().then(res => {
    organizationTree.value = res.data
  }).finally(() => organizationTreeLoading.value = false)
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
function load() {
  loading.value = true
  retrieveRoles(pagination.page, pagination.size, searchForm.value).then(res => {
    datas.value = res.data.content
    pagination.total = res.data.totalElements
  }).finally(() => loading.value = false)
}

/**
 * reset
 */
function reset() {
  searchForm.value = {
    name: null
  }
  load()
}

onMounted(() => {
  load()
  loadPrivilegeTree()
  loadDepartmentTree()
})

/**
 * 弹出框
 * @param id 主键
 */
function saveOrUpdate(id?: number) {
  if (id) {
    loadOne(id)
  }
  dialogVisible.value = true
}

/**
 * 加载
 * @param id 主键
 */
function loadOne(id: number) {
  fetchRole(id).then(res => {
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
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 删除
 * @param id 主键
 */
function removeHandler(id: number) {
  datas.value = datas.value.filter(item => item.id !== id)
}

/**
 * 确认
 * @param id 主键
 */
function confirmEvent(id: number) {
  if (id) {
    removeHandler(id)
  }
}

/**
 * 权限树操作
 */
function handlePrivilegeCheckChange() { }

/**
 * 组织树操作
 */
function handleDepartmentCheckChange() { }

/**
 * 行选择操作
 * @param val 选中行
 */
function handleCurrentChange(row: Role | undefined) {
  if (row && row.id) {
    Promise.all([retrieveRolePrivileges(row.id), retrieveRoleDepartments(row.id)])
      .then(([rpRes, rdRes]) => {
        rolePrivileges.value = rpRes.data
        roleDepartments.value = rdRes.data
      })
  }
}

</script>

<template>
  <div>
    <ElSpace size="large" fill>
      <ElCard shadow="never" class="search">
        <ElForm inline :model="searchForm" @submit.prevent>
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="searchForm.name" :placeholder="$t('inputText') + $t('name')" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="load">
              <div class="i-ph:magnifying-glass" />{{ $t('search') }}
            </ElButton>
            <ElButton @click="reset">
              <div class="i-ph:arrow-counter-clockwise" />{{ $t('reset') }}
            </ElButton>
          </ElFormItem>
        </ElForm>
      </ElCard>

      <ElRow :gutter="16">
        <ElCol :span="16">
          <ElCard shadow="never">
            <ElRow :gutter="20" justify="space-between" class="mb-4">
              <ElCol :span="16" class="text-left">
                <ElButton type="primary" @click="saveOrUpdate()">
                  <div class="i-ph:plus" />{{ $t('add') }}
                </ElButton>
                <ElButton type="danger" plain>
                  <div class="i-ph:trash" />{{ $t('remove') }}
                </ElButton>
                <ElButton type="warning" plain @click="dialogVisible = true">
                  <div class="i-ph:file-arrow-up" />{{ $t('import') }}
                </ElButton>
                <ElButton type="success" plain>
                  <div class="i-ph:cloud-arrow-down" />{{ $t('export') }}
                </ElButton>
              </ElCol>

              <ElCol :span="8" class="text-right">
                <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
                  <ElButton type="primary" plain circle @click="load">
                    <template #icon>
                      <div class="i-ph:arrow-clockwise" />
                    </template>
                  </ElButton>
                </ElTooltip>

                <ElTooltip class="box-item" effect="dark" :content="$t('settings')" placement="top">
                  <ElButton type="success" plain circle>
                    <template #icon>
                      <div class="i-ph:text-columns" />
                    </template>
                  </ElButton>
                </ElTooltip>
              </ElCol>
            </ElRow>

            <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto"
              highlight-current-row @current-change="handleCurrentChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn type="index" :label="$t('no')" width="55" />
              <ElTableColumn prop="name" :label="$t('name')" />
              <ElTableColumn prop="enabled" :label="$t('status')">
                <template #default="scope">
                  <ElSwitch size="small" v-model="scope.row.enabled"
                    style="--el-switch-on-color: var(--el-color-success);" />
                </template>
              </ElTableColumn>
              <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
              <ElTableColumn :label="$t('action')">
                <template #default="scope">
                  <ElButton size="small" type="primary" link @click="saveOrUpdate(scope.row.id)">
                    <div class="i-ph:pencil-simple-line" />{{ $t('edit') }}
                  </ElButton>
                  <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
                    <template #reference>
                      <ElButton size="small" type="danger" link>
                        <div class="i-ph:trash" />{{ $t('remove') }}
                      </ElButton>
                    </template>
                  </ElPopconfirm>
                </template>
              </ElTableColumn>
            </ElTable>
            <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
              :total="pagination.total" />
          </ElCard>
        </ElCol>
        <ElCol :span="8">
          <ElCard shadow="never" class="h-full">
            <ElTabs stretch>
              <ElTabPane :label="$t('actionPrivilege')" class="w-full">
                <ElTree ref="treeEl" v-loading="privilegeTreeLoading" :data="privilegeTree"
                  :expand-on-click-node="false" node-key="id" :props="{ label: 'name' }" show-checkbox
                  @check-change="handlePrivilegeCheckChange" :default-checked-keys="rolePrivileges">
                  <template #default="{ node, data }">
                    <div class="inline-flex items-center whitespace-nowrap overflow-ellipsis overflow-hidden">
                      <div :class="data.icon" />
                      <span class="ml-2">{{ $t(node.label) }}</span>
                    </div>
                  </template>
                </ElTree>
              </ElTabPane>
              <ElTabPane :label="$t('dataPrivilege')" class="w-full">
                <ElSelect v-model="dataPrivilege" class="mb-3">
                  <ElOption :value="0" label="全部" />
                  <ElOption :value="1" label="本部门" />
                  <ElOption :value="2" label="仅自己" />
                  <ElOption :value="3" label="自定义" />
                </ElSelect>
                <ElTree v-if="dataPrivilege === 3" ref="treeEl" v-loading="organizationTreeLoading"
                  :data="organizationTree" default-expand-all :expand-on-click-node="false" node-key="id"
                  :props="{ label: 'name' }" show-checkbox @check-change="handleDepartmentCheckChange"
                  :default-checked-keys="roleDepartments">
                </ElTree>
              </ElTabPane>
            </ElTabs>
          </ElCard>
        </ElCol>
      </ElRow>
    </ElSpace>

    <Dialog v-model="dialogVisible" :title="$t('role')" width="25%">
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
          <div class="i-ph:x-circle" />{{ $t('cancle') }}
        </ElButton>
        <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
          <div class="i-ph:check-circle" /> {{ $t('commit') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>
