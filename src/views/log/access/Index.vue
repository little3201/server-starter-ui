<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { retrieveAccessLogs, fetchAccessLog } from '~/api/access-logs'
import type { AccessLog } from '~/api/models.type'

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const loading = ref<boolean>(false)
const datas = ref<Array<AccessLog>>([])

const searchForm = ref({
  api: null,
  operator: null
})

const detailLoading = ref<boolean>(false)
const detail = ref<AccessLog>({
  id: undefined,
  operator: "",
  api: "",
  method: "PST",
  params: null,
  ip: "",
  location: "",
  status: null,
  responseTime: null,
  responseCode: null,
  responseMessage: ""
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

/**
 * 加载
 * @param id 主键
 */
function loadOne(id: number) {
  detailLoading.value = true
  fetchAccessLog(id).then(res => {
    detail.value = res.data
  }).finally(() => detailLoading.value = false)
}

/**
 * reset
 */
function reset() {
  searchForm.value = {
    api: null,
    operator: null
  }
  load()
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
  loadOne(id)
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
  <ElSpace size="large" fill>
    <ElCard shadow="never" class="search">
      <ElForm inline :model="searchForm">
        <ElFormItem :label="$t('api')" prop="api">
          <ElInput v-model="searchForm.api" :placeholder="$t('inputText') + $t('api')" />
        </ElFormItem>
        <ElFormItem :label="$t('operator')" prop="operator">
          <ElInput v-model="searchForm.operator" :placeholder="$t('inputText') + $t('operator')" />
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
          <ElButton type="danger" plain>
            <div class="i-ph:trash"></div>{{ $t('clear') }}
          </ElButton>
          <ElButton type="success" plain>
            <div class="i-ph:cloud-arrow-down"></div>{{ $t('export') }}
          </ElButton>
        </ElCol>

        <ElCol :span="8" class="text-right">
          <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
            <ElButton type="primary" plain circle @click="load">
              <template #icon>
                <div class="i-ph:arrow-clockwise"></div>
              </template>
            </ElButton>
          </ElTooltip>

          <ElTooltip class="box-item" effect="dark" :content="$t('settings')" placement="top">
            <ElButton type="success" plain circle>
              <template #icon>
                <div class="i-ph:table"></div>
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
            <ElButton size="small" type="success" link @click="detailHandler(scope.row.id)">
              <div class="i-ph:file-text"></div>{{ $t('detail') }}
            </ElButton>
            <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
              <template #reference>
                <ElButton size="small" type="danger" link>
                  <div class="i-ph:trash"></div>{{ $t('remove') }}
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


  <Dialog v-model="dialogVisible" :title="$t('detail')">
    <ElDescriptions v-loading="detailLoading">
      <ElDescriptionsItem :label="$t('api')">{{ detail.api }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('params')">{{ detail.params }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('method')">{{ detail.method }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('ip')">{{ detail.ip }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('location')">{{ detail.location }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('operator')">{{ detail.operator }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('status')">
        <ElTag v-if="detail.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
        <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('responseTime')">{{ detail.responseTime }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('responseCode')">{{ detail.responseCode }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('responseMessage')">{{ detail.responseMessage }}</ElDescriptionsItem>
    </ElDescriptions>
  </Dialog>
</template>
