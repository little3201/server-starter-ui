<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrieveOrganizationTree } from '~/api/organizations'
import { retrieveUsers, fetchUser } from '~/api/users'
import { retrieveRoles } from '~/api/roles'
import type { TreeNode, User, Role } from '~/models'

const loading = ref<boolean>(false)
const datas = ref<Array<User>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const treeEl = ref()
const treeLoading = ref<boolean>(false)
const currentNodeKey = ref<number>()
const currentNode = ref('')

const organizationTree = ref<TreeNode[]>([])
const organizationsOptions = ref<TreeNode[]>([])
const rolesOptions = ref<Role[]>([])

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const searchForm = ref({
  username: null,
  email: null
})

const formRef = ref<FormInstance>()
const form = ref<User>({
  username: '',
  email: '',
  role: undefined,
  organization: undefined
})

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
 * 加载tree
 */
function loadTree() {
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
    rolesOptions.value = res.data
  })
}

/**
 * 加载列表
 */
function load() {
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
  const roles = rolesOptions.value.filter(item => item.id === value)
  if (roles && roles.length > 0) {
    return roles[0].name
  }
  return ""
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
</script>

<template>
  <div>
    <div class="flex justify-between space-x-4">
      <ElCard class="w-64 flex-shrink-0" shadow="never">
        <ElFormItem prop="currentNode">
          <ElInput v-model="currentNode" :placeholder="$t('search')" clearable>
            <template #prefix>
              <div class="i-ph:magnifying-glass" />
            </template>
          </ElInput>
        </ElFormItem>
        <ElDivider />
        <ElTree ref="treeEl" v-loading="treeLoading" :data="organizationTree" default-expand-all
          :expand-on-click-node="false" node-key="id" :current-node-key="currentNodeKey" :props="{ label: 'name' }"
          :filter-node-method="filterNode" @current-change="currentChange">
        </ElTree>
      </ElCard>

      <ElSpace fill direction="vertical" class="flex-1" size="large">
        <ElCard shadow="never" class="search">
          <ElForm inline :model="searchForm">
            <ElFormItem :label="$t('username')" prop="username">
              <ElInput v-model="searchForm.username" :placeholder="$t('inputText') + $t('username')" />
            </ElFormItem>
            <ElFormItem :label="$t('email')" prop="email">
              <ElInput type="email" v-model="searchForm.email" :placeholder="$t('inputText') + $t('email')" />
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

        <ElCard shadow="never">
          <ElRow :gutter="20" justify="space-between" class="mb-4">
            <ElCol :span="16" class="text-left">
              <ElButton type="primary" @click="saveOrUpdate()">
                <div class="i-ph:plus" />{{ $t('add') }}
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
            >
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn type="index" :label="$t('no')" width="55" />
            <ElTableColumn show-overflow-tooltip prop="username" :label="$t('username')">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <ElAvatar :size="28" src="#" />
                  <span style="margin-left: 10px">{{ scope.row.username }}</span>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn show-overflow-tooltip prop="email" :label="$t('email')" />
            <ElTableColumn show-overflow-tooltip prop="role" :label="$t('role')">
              <template #default="scope">
                {{ formatRole(scope.row.role) }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="enabled" :label="$t('status')">
              <template #default="scope">
                <ElSwitch size="small" v-model="scope.row.enabled"
                  style="--el-switch-on-color: var(--el-color-success);" />
              </template>
            </ElTableColumn>
            <ElTableColumn :label="$t('actions')">
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
      </ElSpace>
    </div>

    <Dialog v-model="dialogVisible" :title="$t('user')" width="36%">
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
            <ElFormItem :label="$t('role')" prop="role">
              <ElSelect v-model="form.role" :placeholder="$t('selectText') + $t('role')">
                <ElOption v-for="item in rolesOptions" :key="item.id" :label="item.name" :value="item.id" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('organization')" prop="organization">
              <ElTreeSelect v-model="form.organization" :data="organizationsOptions" node-key="id"
                :props="{ label: 'name' }" check-strictly :render-after-expand="false" />
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
