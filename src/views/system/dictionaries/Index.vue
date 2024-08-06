<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrieveDictionaries, fetchDictionary } from '~/api/dictionaries'
import type { Dictionary } from '~/models'
import SubPage from './SubPage.vue'


const loading = ref<boolean>(false)
const datas = ref<Array<Dictionary>>([])
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

const formRef = ref<FormInstance>()
const form = ref<Dictionary>({
  name: '',
  order: 1,
  children: [],
})

const rules = reactive<FormRules<typeof form>>({
  name: [
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
function load() {
  loading.value = true
  retrieveDictionaries(pagination.page, pagination.size, searchForm.value).then(res => {
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
  fetchDictionary(id).then(res => {
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

      <ElCard shadow="never">
        <ElRow :gutter="20" justify="space-between" class="mb-4">
          <ElCol :span="16" class="text-left">
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
          <ElTableColumn type="expand">
            <template #default="props">
              <SubPage :superior-id="props.row.id" :title="props.row.name" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="name" :label="$t('name')" />
          <ElTableColumn prop="enabled" :label="$t('status')">
            <template #default="scope">
              <ElSwitch size="small" v-model="scope.row.enabled"
                style="--el-switch-on-color: var(--el-color-success);" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="order" :label="$t('order')" />
          <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
          <ElTableColumn :label="$t('action')">
            <template #default="scope">
              <ElButton size="small" type="primary" link @click="saveOrUpdate(scope.row.id)">
                <div class="i-ph:pencil-simple-line" />{{ $t('edit') }}
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
          :total="pagination.total" />
      </ElCard>
    </ElSpace>

    <Dialog v-model="dialogVisible" :title="$t('dictionary')" width="25%">
      <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('name')" prop="name">
              <ElInput v-model="form.name" :placeholder="$t('inputText') + $t('name')" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('order')" prop="order">
              <ElInputNumber v-model="form.order" :placeholder="$t('inputText') + $t('order')" />
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
