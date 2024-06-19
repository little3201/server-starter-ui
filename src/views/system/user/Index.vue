<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrieveDepartments, retrieveDepartmentTree } from '~/api/departments'
import { retrieveUsers, fetchUser } from '~/api/users'
import { retrieveRoles } from '~/api/roles'
import type { TreeNode, Department, User, Role } from '~/api/models.type'

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

const departmentTree = ref<TreeNode[]>([])
const departmentsOptions = ref<Department[]>([])
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
  department: undefined
})

const rules = reactive<FormRules<typeof form>>({
  username: [
    { required: true, trigger: 'blur' }
  ],
  email: [
    { required: true, trigger: 'blur' },
    { min: 8, max: 16, message: 'Length should be 8 to 16', trigger: 'blur' },
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
  retrieveDepartmentTree().then(res => {
    departmentTree.value = res.data
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
 * 加载部门
 */
function fetchDepartments() {
  retrieveDepartments(1, 10).then(res => {
    departmentsOptions.value = res.data.content
  })
}

/**
 * 加载角色
 */
function fetchRoles() {
  retrieveRoles(1, 10).then(res => {
    rolesOptions.value = res.data.content
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
  fetchDepartments()
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
</script>

<template>
  <div>
    <div class="flex justify-between space-x-4">
      <ElCard class="w-64 flex-shrink-0" shadow="never">
        <ElFormItem prop="currentNode">
          <ElInput v-model="currentNode" :placeholder="$t('search')" clearable>
            <template #prefix>
              <div class="i-ph:magnifying-glass"></div>
            </template>
          </ElInput>
        </ElFormItem>
        <ElDivider />
        <ElTree ref="treeEl" v-loading="treeLoading" :data="departmentTree" default-expand-all
          :expand-on-click-node="false" node-key="id" :current-node-key="currentNodeKey" :props="{ label: 'name' }"
          :filter-node-method="filterNode" @current-change="currentChange">
          <template #default="{ data }">
            <div :title="data.name" class="whitespace-nowrap overflow-ellipsis overflow-hidden">
              {{ data.name }}
            </div>
          </template>
        </ElTree>
      </ElCard>

      <ElSpace fill direction="vertical" class="flex-1" size="large">
        <ElCard shadow="never" class="search">
          <ElForm inline :model="searchForm">
            <ElFormItem :label="$t('username')" prop="username">
              <ElInput v-model="searchForm.username" :placeholder="$t('placeholderInput') + $t('username')" />
            </ElFormItem>
            <ElFormItem :label="$t('email')" prop="email">
              <ElInput type="email" v-model="searchForm.email" :placeholder="$t('placeholderInput') + $t('email')" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary" @click="load">
                <div class="i-ph:magnifying-glass"></div>{{ $t('search') }}
              </ElButton>
              <ElButton @click="reset">
                <div class="i-ph:arrow-counter-clockwise"></div>{{ $t('reset') }}
              </ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <ElCard shadow="never">
          <ElRow :gutter="20" justify="space-between" class="mb-4">
            <ElCol :span="16" class="text-left">
              <ElButton type="primary" @click="saveOrUpdate()">
                <div class="i-ph:plus"></div>{{ $t('add') }}
              </ElButton>
              <ElButton type="danger">
                <div class="i-ph:trash"></div>{{ $t('remove') }}
              </ElButton>
              <ElButton type="warning" @click="dialogVisible = true">
                <div class="i-ph:file-arrow-up"></div>{{ $t('import') }}
              </ElButton>
              <ElButton type="success">
                <div class="i-ph:cloud-arrow-down"></div>{{ $t('export') }}
              </ElButton>
            </ElCol>

            <ElCol :span="8" class="text-right">
              <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
                <ElButton type="primary" circle @click="load">
                  <template #icon>
                    <div class="i-ph:arrow-clockwise"></div>
                  </template>
                </ElButton>
              </ElTooltip>

              <ElTooltip class="box-item" effect="dark" :content="$t('settings')" placement="top">
                <ElButton type="success" circle>
                  <template #icon>
                    <div class="i-ph:list-magnifying-glass"></div>
                  </template>
                </ElButton>
              </ElTooltip>
            </ElCol>
          </ElRow>

          <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto"
            layout="prev, pager, next, sizes, jumper, ->, total">
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
            <ElTableColumn show-overflow-tooltip prop="role" :label="$t('role')" />
            <ElTableColumn prop="enabled" :label="$t('status')">
              <template #default="scope">
                <ElSwitch size="small" v-model="scope.row.enabled"
                  style="--el-switch-on-color: var(--el-color-success);" />
              </template>
            </ElTableColumn>
            <ElTableColumn :label="$t('action')">
              <template #default="scope">
                <ElButton size="small" type="primary" @click="saveOrUpdate(scope.row.id)">
                  <div class="i-ph:pencil-simple-line"></div>{{ $t('edit') }}
                </ElButton>
                <ElButton size="small" type="danger" @click="removeHandler(scope.row.id)">
                  <div class="i-ph:trash"></div>{{ $t('remove') }}
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
            :total="pagination.total" />
        </ElCard>
      </ElSpace>
    </div>

    <Dialog v-model="dialogVisible" :title="$t('user')" :width="'36%'">
      <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('username')" prop="username">
              <ElInput v-model="form.username" :placeholder="$t('placeholderInput') + $t('username')" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('email')" prop="email">
              <ElInput type="email" v-model="form.email" :placeholder="$t('placeholderInput') + $t('email')"
                show-password />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('role')" prop="role">
              <ElSelect v-model="form.role" :placeholder="$t('placeholderSelect') + $t('role')" style="width: 100%">
                <ElOption v-for="item in rolesOptions" :key="item.id" :label="item.name" :value="item.id" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('department')" prop="department">
              <ElSelect v-model="form.department" :placeholder="$t('placeholderSelect') + $t('department')"
                style="width: 100%">
                <ElOption v-for="item in departmentsOptions" :key="item.id" :label="item.name" :value="item.id" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
          <div class="i-ph:check-circle"></div> {{ $t('commit') }}
        </ElButton>
        <ElButton @click="dialogVisible = false">
          <div class="i-ph:x-circle"></div>{{ $t('cancle') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>
