<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrievePrivileges, retrievePrivilegeSubset, fetchPrivilege } from '~/api/privileges'
import type { Privilege, PrivilegeTreeNode } from '~/api/models.type'

const loading = ref<boolean>(false)
const datas = ref<Array<PrivilegeTreeNode>>([])
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
})

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const searchForm = ref({
  name: null
})

const formRef = ref<FormInstance>()

const oldComponent = ref<string>('#')
const form = ref<Privilege>({
  category: 'M',
  name: '',
  path: '',
  order: 1,
  component: '',
  redirect: '',
  meta: {
    icon: '',
  },
  enabled: true,
  description: ''
})

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ],
  path: [
    { required: true, trigger: 'blur' }
  ]
})

/**
 * 分页变化
 * @param value 当前页码
 */
function pageChange(currentPage: number, pageSize: number) {
  pagination.value.page = currentPage
  pagination.value.size = pageSize
  load()
}

/**
 * 加载列表
 */
function load(row?: Privilege, treeNode?: unknown, resolve?: (data: Privilege[]) => void) {
  loading.value = true
  if (row && row.id && resolve) {
    retrievePrivilegeSubset(row.id).then(res => {
      resolve(res.data)
    }).finally(() => loading.value = false)
  } else {
    retrievePrivileges(pagination.value.page, pagination.value.size, searchForm.value).then(res => {
      datas.value = res.data.content
      pagination.value.total = res.data.totalElements
    }).finally(() => loading.value = false)
  }
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

/**
 * radio change
 * @param value radio值
 */
function radioChange(value: string | number | boolean | undefined) {
  if (value === 'D') {
    form.value.component = '#'
  } else {
    form.value.component = oldComponent.value || ''
  }
}

onMounted(() => {
  load()
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
  fetchPrivilege(id).then(res => {
    form.value = res.data
    oldComponent.value = res.data.component
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
</script>

<template>
  <div>
    <ElSpace size="large" fill>
      <ElCard shadow="never" class="search">
        <ElForm ref="searchFormRef" inline :model="searchForm">
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="searchForm.name" :placeholder="$t('placeholder_input') + $t('name')" />
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

        <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto">
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn prop="name" :label="$t('name')">
            <template #default="scope">
              {{ $t(scope.row.name.toLocaleLowerCase()) }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="meta.icon" :label="$t('icon')">
            <template #default="scope">
              <div :class="scope.row.meta.icon" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="path" :label="$t('path')" />
          <ElTableColumn prop="component" :label="$t('component')" />
          <ElTableColumn prop="order" :label="$t('order')" />
          <ElTableColumn prop="enabled" :label="$t('status')">
            <template #default="scope">
              <ElSwitch size="small" v-model="scope.row.enabled"
                style="--el-switch-on-color: var(--el-color-success);" />
            </template>
          </ElTableColumn>
          <ElTableColumn :show-overflow-tooltip="true" prop="description" :label="$t('description')" />
          <ElTableColumn :label="$t('actions')">
            <template #default="scope">
              <ElButton size="small" type="success" @click="saveOrUpdate(scope.row.id)">
                <div class="i-ph:plus"></div>{{ $t('add_sub') }}
              </ElButton>
              <ElButton size="small" type="primary" @click="saveOrUpdate(scope.row.id)">
                <div class="i-ph:pencil-simple-line"></div>{{ $t('edit') }}
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
          :total="pagination.total" />
      </ElCard>
    </ElSpace>

    <Dialog v-model="dialogVisible" :title="$t('privilege')" :width="'40%'">
      <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
        <ElSpace size="large" fill :fill-ratio="45" class="w-full">
          <ElFormItem :label="$t('category')" prop="category">
            <ElRadioGroup v-model="form.category" @change="radioChange">
              <ElRadioButton label="目录" value="D" />
              <ElRadioButton label="菜单" value="M" />
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem :label="$t('order')" prop="order">
            <ElInputNumber v-model="form.order" :placeholder="$t('placeholder_input') + $t('order')" />
          </ElFormItem>
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="form.name" :placeholder="$t('placeholder_input') + $t('name')" />
          </ElFormItem>
          <ElFormItem :label="$t('component')" prop="component">
            <ElInput v-model="form.component" :placeholder="$t('placeholder_input') + $t('component')"
              :disabled="form.category === 'D'" />
          </ElFormItem>
          <ElFormItem :label="$t('icon')" prop="meta.icon">
            <ElInput v-model="form.meta.icon" :placeholder="$t('placeholder_input') + $t('icon')" />
          </ElFormItem>
          <ElFormItem :label="$t('path')" prop="path">
            <ElInput v-model="form.path" :placeholder="$t('placeholder_input') + $t('path')" />
          </ElFormItem>
          <ElFormItem :label="$t('description')" prop="description">
            <ElInput v-model="form.description" type="textarea" :placeholder="$t('description')" />
          </ElFormItem>
        </ElSpace>
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
