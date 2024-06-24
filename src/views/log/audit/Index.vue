<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { dayjs } from 'element-plus'
import { retrieveAuditLogs, fetchAuditLog } from '~/api/audit-logs'
import type { AuditLog } from '~/api/models.type'


const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const loading = ref<boolean>(false)
const datas = ref<Array<AuditLog>>([])
const searchForm = ref({
  resource: null,
  operator: null
})

const detailLoading = ref<boolean>(false)
const detail = ref<AuditLog>({
  id: undefined,
  action: "",
  operator: "",
  resource: "",
  oldValue: "",
  newValue: null,
  ip: "",
  location: "",
  status: null,
  actionTime: null
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
  retrieveAuditLogs(pagination.page, pagination.size).then(res => {
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
  fetchAuditLog(id).then(res => {
    detail.value = res.data
  }).finally(() => detailLoading.value = false)
}

/**
 * reset
 */
 function reset() {
  searchForm.value = {
    resource: null,
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
</script>

<template>
  <ElSpace size="large" fill>
    <ElCard shadow="never" class="search">
      <ElForm inline :model="searchForm">
        <ElFormItem :label="$t('resource')" prop="resource">
          <ElInput v-model="searchForm.resource" :placeholder="$t('inputText') + $t('resource')" />
        </ElFormItem>
        <ElFormItem :label="$t('operator')" prop="operator">
          <ElInput v-model="searchForm.operator" :placeholder="$t('inputText') + $t('operator')" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="load">
            <div class="ph:magnifying-glass"></div>{{ $t('search') }}
          </ElButton>
          <ElButton @click="reset">
            <div class="ph:arrow-counter-clockwise"></div>{{ $t('reset') }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <ElRow :gutter="20" justify="space-between" class="mb-4">
        <ElCol :span="16" class="text-left">
          <ElButton type="success" plain>
            <div class="ph:cloud-arrow-down"></div>{{ $t('export') }}
          </ElButton>
        </ElCol>

        <ElCol :span="8" class="text-right">
          <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
            <ElButton type="primary" plain circle @click="load">
              <template #icon>
                <div class="ph:arrow-clockwise"></div>
              </template>
            </ElButton>
          </ElTooltip>

          <ElTooltip class="box-item" effect="dark" :content="$t('settings')" placement="top">
            <ElButton type="success" plain circle>
              <template #icon>
                <div class="ph:table"></div>
              </template>
            </ElButton>
          </ElTooltip>
        </ElCol>
      </ElRow>

      <ElTable :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto" height="calc(100vh - 350px)">
        <ElTableColumn type="index" :label="$t('no')" width="55" />
        <ElTableColumn prop="action" :label="$t('action')" />
        <ElTableColumn prop="resource" :label="$t('resource')" />
        <ElTableColumn show-overflow-tooltip prop="oldValue" :label="$t('oldValue')" />
        <ElTableColumn show-overflow-tooltip prop="newValue" :label="$t('newValue')" />
        <ElTableColumn prop="ip" :label="$t('ip')" />
        <ElTableColumn prop="location" :label="$t('location')" />
        <ElTableColumn prop="status" :label="$t('status')">
          <template #default="scope">
            <ElTag v-if="scope.row.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
            <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="actionTime" :label="$t('actionTime')">
          <template #default="scope">
            {{ dayjs(scope.row.actionTime).format('YY-M-D HH:mm:ss') }}
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('action')">
          <template #default="scope">
            <ElButton size="small" type="success" link @click="detailHandler(scope.row.id)">
              <div class="ph:file-text"></div>{{ $t('detail') }}
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
        :total="pagination.total" />
    </ElCard>
  </ElSpace>

  <Dialog v-model="dialogVisible" :title="$t('detail')">
    <ElDescriptions v-loading="detailLoading">
      <ElDescriptionsItem :label="$t('action')">{{ detail.action }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('resource')">{{ detail.resource }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('oldValue')">{{ detail.oldValue }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('ip')">{{ detail.ip }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('location')">{{ detail.location }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('newValue')">{{ detail.newValue }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('operator')">{{ detail.operator }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('status')">
        <ElTag v-if="detail.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
        <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('actionTime')">{{ dayjs(detail.actionTime).format('YY-M-D HH:mm:ss') }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </Dialog>
</template>
