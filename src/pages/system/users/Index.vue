<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import draggable from 'vuedraggable'
import Dialog from 'components/Dialog.vue'
import { retrieveOrganizationTree } from 'src/api/organizations'
import { retrieveUsers, fetchUser } from 'src/api/users'
import { retrieveRoles } from 'src/api/roles'
import type { TreeNode, User, Role } from 'src/models'

const loading = ref<boolean>(false)
const datas = ref<Array<User>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'enabled', 'description'])
const columns = ref<Array<string>>(['name', 'enabled', 'description'])

const treeEl = ref()
const treeLoading = ref<boolean>(false)
const currentNodeKey = ref<number>()
const currentNode = ref('')

const organizationTree = ref<TreeNode[]>([])
const organizationsOptions = ref<TreeNode[]>([])
const roles = ref<Role[]>([])

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const searchForm = ref({
  username: null,
  email: null
})

const formRef = ref<FormInstance>()
const initialValues: User = {
  username: '',
  email: '',
  role: null,
  accountNonLocked: true,
  organization: null
}
const form = ref<User>({ ...initialValues })

const rules = reactive<FormRules<typeof form>>({
  username: [
    { required: true, trigger: 'blur' }
  ],
  email: [
    { required: true, trigger: 'blur' },
  ]
})

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
  form.value.organization = currentNodeKey.value
  load()
}

/**
 * 加载tree
 */
async function loadTree() {
  treeLoading.value = true
  retrieveOrganizationTree().then(res => {
    organizationTree.value = res.data
    currentNodeKey.value =
      (res.data[0] && res.data[0]?.id) || ''

    treeEl.value.setCurrentKey(currentNodeKey.value)

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
 * 加载组织树
 */
function fetchOrganizations() {
  retrieveOrganizationTree().then(res => {
    organizationsOptions.value = res.data
  })
}

/**
 * 加载角色
 */
function fetchRoles() {
  retrieveRoles().then(res => {
    roles.value = res.data
  })
}

/**
 * 加载列表
 */
async function load() {
  loading.value = true
  retrieveUsers(pagination.page, pagination.size, currentNodeKey.value, searchForm.value).then(res => {
    datas.value = res.data.content
    pagination.total = res.data.totalElements
  }).finally(() => loading.value = false)
}

/**
 * 角色显示格式化
 */
function formatRole(value: number) {
  const filtered = roles.value.filter(item => item.id === value)
  if (filtered && filtered.length > 0) {
    return filtered[0].name
  }
  return ''
}

/**
 * reset
 */
function reset() {
  searchForm.value = {
    username: null,
    email: null
  }
  load()
}

onMounted(() => {
  loadTree()
  fetchOrganizations()
  fetchRoles()
})

/**
 * 监听tree
 */
watch(
  () => currentNode.value,
  (val) => {
    treeEl.value.filter(val)
  }
)

/**
 * 弹出框
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
  fetchUser(id).then(res => {
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
function removeRow(id: number) {
  datas.value = datas.value.filter(item => item.id !== id)
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
 * 解锁/上锁
 * @param row 数据
 */
function lockRow(row: User) {
  row.accountNonLocked = !row.accountNonLocked
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
      <ElTree ref="treeEl" v-loading="treeLoading" :data="organizationTree" default-expand-all
        :expand-on-click-node="false" node-key="id" :current-node-key="currentNodeKey" :props="{ label: 'name' }"
        :filter-node-method="filterNode" @current-change="currentChange">
      </ElTree>
    </ElCard>

    <div class="w-full">
      <ElSpace size="large" direction="vertical" fill class="w-full">
        <ElCard shadow="never">
          <ElForm inline :model="searchForm">
            <ElFormItem :label="$t('username')" prop="username">
              <ElInput v-model="searchForm.username" :placeholder="$t('inputText') + $t('username')" />
            </ElFormItem>
            <ElFormItem :label="$t('email')" prop="email">
              <ElInput type="email" v-model="searchForm.email" :placeholder="$t('inputText') + $t('email')" />
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
              <ElTooltip effect="dark" :content="$t('refresh')" placement="top">
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
            <ElTableColumn show-overflow-tooltip prop="username" :label="$t('username')">
              <template #default="scope">
                <div class="flex items-center">
                  <ElAvatar :size="24" :src="scope.row.avatar" class="flex-shrink-0" />
                  <span style="margin-left: 10px">{{ scope.row.username }}</span>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="email" :label="$t('email')" />
            <ElTableColumn show-overflow-tooltip prop="role" :label="$t('roles')">
              <template #default="scope">
                {{ formatRole(scope.row.role) }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="accountNonLocked" :label="$t('accountNonLocked')">
              <template #default="scope">
                <div
                  :class="['cursor-pointer', scope.row.accountNonLocked ? 'i-material-symbols:lock-open-right-outline-rounded text-[var(--el-color-success)]' : 'i-material-symbols:lock-outline text-[var(--el-color-warning)]']"
                  @click="lockRow(scope.row)" />
              </template>
            </ElTableColumn>
            <ElTableColumn prop="enabled" :label="$t('enabled')">
              <template #default="scope">
                <ElSwitch size="small" v-model="scope.row.enabled"
                  style="--el-switch-on-color: var(--el-color-success);" />
              </template>
            </ElTableColumn>
            <ElTableColumn :label="$t('actions')">
              <template #default="scope">
                <ElButton size="small" type="primary" link @click="editRow(scope.row.id)">
                  <div class="i-material-symbols:edit-outline-rounded" />{{ $t('edit') }}
                </ElButton>
                <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
                  <template #reference>
                    <ElButton size="small" type="danger" link>
                      <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
                    </ElButton>
                  </template>
                </ElPopconfirm>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
            :total="pagination.total" />
        </ElCard>
      </ElSpace>
    </div>
  </div>

  <Dialog v-model="dialogVisible" :title="$t('users')" width="36%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol :span="12">
          <ElFormItem :label="$t('username')" prop="username">
            <ElInput v-model="form.username" :placeholder="$t('inputText') + $t('username')" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem :label="$t('email')" prop="email">
            <ElInput type="email" v-model="form.email" :placeholder="$t('inputText') + $t('email')" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol :span="12">
          <ElFormItem :label="$t('roles')" prop="role">
            <ElSelect v-model="form.role" :placeholder="$t('selectText') + $t('role')">
              <ElOption v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
            </ElSelect>
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
</template>
