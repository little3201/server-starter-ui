<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrievePrivileges, retrievePrivilegeSubset, fetchPrivilege } from '~/api/privileges'
import type { Privilege, PrivilegeTreeNode } from '~/api/models.type'

const loading = ref<boolean>(false)
const datas = ref<Array<PrivilegeTreeNode>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const searchForm = ref({
  name: null
})

const iconName = ref('')
const icons = ref(['gear', 'user', 'users', 'book', 'plus', 'trash', 'key', 'gear', 'user', 'users', 'book', 'plus', 'trash', 'key', 'gear', 'user', 'users', 'book', 'plus', 'trash', 'key', 'gear', 'user', 'users', 'book', 'plus', 'trash', 'key'])
const filterIcons = computed(() => icons.value.filter(item => item.includes(iconName.value)))

const formRef = ref<FormInstance>()

const oldComponent = ref<string>('#')
const form = ref<Privilege>({
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
function load(row?: Privilege, treeNode?: unknown, resolve?: (data: Privilege[]) => void) {
  loading.value = true
  if (row && row.id && resolve) {
    retrievePrivilegeSubset(row.id).then(res => {
      resolve(res.data)
    }).finally(() => loading.value = false)
  } else {
    retrievePrivileges(pagination.page, pagination.size, searchForm.value).then(res => {
      datas.value = res.data.content
      pagination.total = res.data.totalElements
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
            <ElInput v-model="searchForm.name" :placeholder="$t('placeholderInput') + $t('name')" />
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
              {{ $t(scope.row.name.replace(scope.row.name[0], scope.row.name[0].toLowerCase())) }}
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
          <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
          <ElTableColumn :label="$t('action')">
            <template #default="scope">
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
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('name')" prop="name">
              <ElInput v-model="form.name" :placeholder="$t('placeholderInput') + $t('name')" disabled />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('path')" prop="path">
              <ElInput v-model="form.path" :placeholder="$t('placeholderInput') + $t('path')" disabled />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('component')" prop="component">
              <ElInput v-model="form.component" :placeholder="$t('placeholderInput') + $t('component')" disabled />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('order')" prop="order">
              <ElInputNumber v-model="form.order" :placeholder="$t('placeholderInput') + $t('order')" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol>
            <ElFormItem :label="$t('icon')" prop="meta.icon" class="relative">
              <!-- width 相对body设置, popover默认设置了 position: absolute -->
              <ElPopover trigger="click" width="36%">
                <template #reference>
                  <ElInput v-model="form.meta.icon" :placeholder="$t('placeholderInput') + $t('icon')">
                  </ElInput>
                </template>
                <!-- <div> -->
                <ElInput v-model="iconName" :placeholder="$t('placeholderInput') + $t('icon')">
                </ElInput>
                <div class="flex flex-wrap max-h-48 overflow-y-scroll mt-4">
                  <div v-for="(icon, index) in filterIcons" :key="index" @click="form.meta.icon = ('i-ph:' + icon)"
                    :class="['inline-flex items-center cursor-pointer w-1/5 h-8 hover:text-[var(--el-color-primary)]', { 'text-[var(--el-color-primary)': form.meta.icon === ('i-ph:' + icon) }]">
                    <div :class="['w-5 h-5', 'i-ph:' + icon]" />
                    <span class="ml-2 text-base">{{ icon }}</span>
                  </div>
                </div>
                <!-- </div> -->
              </ElPopover>
            </ElFormItem>
          </ElCol>

        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol>
            <ElFormItem :label="$t('description')" prop="description">
              <ElInput v-model="form.description" type="textarea" :placeholder="$t('description')" />
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
