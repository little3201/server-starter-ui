<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { dayjs } from 'element-plus'
import { retrieveActionLogs, fetchActionLog } from '~/api/action-logs'
import type { ActionLog } from '~/models'


const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const loading = ref<boolean>(false)
const datas = ref<Array<ActionLog>>([])

const searchForm = ref({
  module: null,
  operator: null
})

const detailLoading = ref<boolean>(false)
const detail = ref<ActionLog>({
  id: undefined,
  module: "",
  operator: "",
  method: "PST",
  operation: "",
  params: null,
  ip: "",
  location: "",
  status: null,
  operateTime: null
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
  retrieveActionLogs(pagination.page, pagination.size).then(res => {
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
  fetchActionLog(id).then(res => {
    detail.value = res.data
  }).finally(() => detailLoading.value = false)
}

/**
 * reset
 */
function reset() {
  searchForm.value = {
    module: null,
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
  <div>
    <ElSpace size="large" fill>
      <ElCard shadow="never" class="search">
        <ElForm inline :model="searchForm">
          <ElFormItem :label="$t('module')" prop="module">
            <ElInput v-model="searchForm.module" :placeholder="$t('inputText') + $t('module')" />
          </ElFormItem>
          <ElFormItem :label="$t('operator')" prop="operator">
            <ElInput v-model="searchForm.operator" :placeholder="$t('inputText') + $t('operator')" />
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
            <ElButton type="danger" plain>
              <div class="i-ph:trash" />{{ $t('clear') }}
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

        <ElTable :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto" height="calc(100vh - 350px)">
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn type="index" :label="$t('no')" width="55" />
          <ElTableColumn prop="module" :label="$t('module')" />
          <ElTableColumn prop="operation" :label="$t('operation')" />
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
          <ElTableColumn prop="operateTime" :label="$t('operateTime')">
            <template #default="scope">
              {{ dayjs(scope.row.operateTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('action')" width="160">
            <template #default="scope">
              <ElButton size="small" type="success" link @click="detailHandler(scope.row.id)">
                <div class="i-ph:file-text" />{{ $t('detail') }}
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


    <Dialog v-model="dialogVisible" :title="$t('detail')">
      <ElDescriptions v-loading="detailLoading">
        <ElDescriptionsItem :label="$t('module')">{{ detail.module }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('operation')">{{ detail.operation }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('method')">{{ detail.method }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('params')">{{ detail.params }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('ip')">{{ detail.ip }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('location')">{{ detail.location }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('operator')">{{ detail.operator }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('status')">
          <ElTag v-if="detail.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
          <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('operateTime')">{{ dayjs(detail.operateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </Dialog>
  </div>
</template>
