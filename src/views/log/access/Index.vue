<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { retrieveAccessLogs } from '~/api/access-logs'
import type { AccessLog } from '~/api/models.type'

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const loading = ref<boolean>(false)
const datas = ref<Array<AccessLog>>([])
const searchFormRef = ref()

const searchForm = ref({
  title: ''
})

const dialogVisible = ref<boolean>(false)
/**
 * 分页变化
 * @param value 当前页码
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
  retrieveAccessLogs(pagination.page, pagination.size).then(res => {
    datas.value = res.data.content
    pagination.total = res.data.totalElements
  }).finally(() => loading.value = false)
}

onMounted(() => {
  load()
})

/**
 * 详情
 * @param id 主键
 */
function detailHandler(id: number) {
  dialogVisible.value = true
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
  <ElSpace size="large" fill>
    <ElCard shadow="never" class="search">
      <ElForm ref="searchFormRef" inline :model="searchForm">
        <ElFormItem :label="$t('title')" prop="title">
          <ElInput v-model="searchForm.title" :placeholder="$t('placeholderInput') + $t('title')" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="load">
            <div class="i-ph:magnifying-glass"></div>{{ $t('search') }}
          </ElButton>
          <ElButton>
            <div class="i-ph:arrow-counter-clockwise"></div>{{ $t('reset') }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <ElRow :gutter="20" justify="space-between" class="mb-4">
        <ElCol :span="16" class="text-left">
          <ElButton type="danger">
            <div class="i-ph:trash"></div>{{ $t('clear') }}
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
        height="calc(100vh - 350px)">
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn type="index" :label="$t('no')" width="55" />
        <ElTableColumn prop="api" :label="$t('api')" />
        <ElTableColumn prop="method" :label="$t('method')" />
        <ElTableColumn show-overflow-tooltip prop="params" :label="$t('params')" />
        <ElTableColumn prop="operator" :label="$t('operator')" />
        <ElTableColumn prop="ip" :label="$t('ip')" />
        <ElTableColumn prop="location" :label="$t('location')" />
        <ElTableColumn prop="status" :label="$t('status')">
          <template #default="scope">
            <ElTag v-if="scope.row.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
            <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="responseTime" :label="$t('responseTime')" />
        <ElTableColumn prop="responseCode" :label="$t('responseCode')" />
        <ElTableColumn show-overflow-tooltip prop="responseMessage" :label="$t('responseMessage')" />
        <ElTableColumn :label="$t('action')" width="160">
          <template #default="scope">
            <ElButton size="small" type="success" @click="detailHandler(scope.row.id)">
              <div class="i-ph:file-text"></div>{{ $t('detail') }}
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


  <Dialog v-model="dialogVisible" :title="$t('detail')" :width="'36%'">

  </Dialog>
</template>
