<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrieveRegions, fetchRegion } from '~/api/regions'
import type { Region } from '~/models'

const loading = ref<boolean>(false)
const datas = ref<Array<Region>>([])
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
const form = ref<Region>({
  name: '',
  areaCode: 0,
  postalCode: 0,
  description: ''
})

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ]
})

const dataPrivilege = ref<number>(1)

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
  retrieveRegions(pagination.page, pagination.size, searchForm.value).then(res => {
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
  fetchRegion(id).then(res => {
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
    <ElSpace size="large" fill>
      <ElCard shadow="never" class="search">
        <ElForm inline :model="searchForm" @submit.prevent>
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="searchForm.name" :placeholder="$t('inputText') + $t('name')" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="load">
              <div class="i-mdi:search" />{{ $t('search') }}
            </ElButton>
            <ElButton @click="reset">
              <div class="i-mdi:restore" />{{ $t('reset') }}
            </ElButton>
          </ElFormItem>
        </ElForm>
      </ElCard>

      <ElCard shadow="never">
        <ElRow :gutter="20" justify="space-between" class="mb-4">
          <ElCol :span="16" class="text-left">
            <ElButton type="primary" @click="saveOrUpdate()">
              <div class="i-mdi:plus" />{{ $t('add') }}
            </ElButton>
            <ElButton type="danger" plain>
              <div class="i-mdi:trash-can-outline" />{{ $t('remove') }}
            </ElButton>
            <ElButton type="warning" plain @click="dialogVisible = true">
              <div class="i-mdi:file-upload-outline" />{{ $t('import') }}
            </ElButton>
            <ElButton type="success" plain>
              <div class="i-mdi:file-download-outline" />{{ $t('export') }}
            </ElButton>
          </ElCol>

          <ElCol :span="8" class="text-right">
            <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
              <ElButton type="primary" plain circle @click="load">
                <template #icon>
                  <div class="i-mdi:refresh" />
                </template>
              </ElButton>
            </ElTooltip>

            <ElTooltip class="box-item" effect="dark" :content="$t('column') + $t('settings')" placement="top">
              <ElButton type="success" plain circle>
                <template #icon>
                  <div class="i-mdi:format-list-bulleted" />
                </template>
              </ElButton>
            </ElTooltip>
          </ElCol>
        </ElRow>

        <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto"
          highlight-current-row>
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn type="index" :label="$t('no')" width="55" />
          <ElTableColumn prop="name" :label="$t('name')" />
          <ElTableColumn prop="areaCode" :label="$t('areaCode')" />
          <ElTableColumn prop="postalCode" :label="$t('postalCode')" />
          <ElTableColumn prop="enabled" :label="$t('enabled')">
            <template #default="scope">
              <ElSwitch size="small" v-model="scope.row.enabled"
                style="--el-switch-on-color: var(--el-color-success);" />
            </template>
          </ElTableColumn>
          <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
          <ElTableColumn :label="$t('actions')">
            <template #default="scope">
              <ElButton size="small" type="primary" link @click="saveOrUpdate(scope.row.id)">
                <div class="i-mdi:pencil-outline" />{{ $t('edit') }}
              </ElButton>
              <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
                <template #reference>
                  <ElButton size="small" type="danger" link>
                    <div class="i-mdi:trash-can-outline" />{{ $t('remove') }}
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

    <Dialog v-model="dialogVisible" :title="$t('regions')" width="25%">
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
          <div class="i-mdi:close" />{{ $t('cancle') }}
        </ElButton>
        <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
          <div class="i-mdi:check-circle-outline" /> {{ $t('commit') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>
