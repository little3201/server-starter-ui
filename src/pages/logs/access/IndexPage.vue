<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import draggable from 'vuedraggable'
import DialogView from 'components/DialogView.vue'
import { retrieveAccessLogs, fetchAccessLog, removeAccessLog } from 'src/api/access-logs'
import type { Pagination, AccessLog } from 'src/types'
import { formatDuration } from 'src/utils'
import { httpMethods } from 'src/constants'

const loading = ref<boolean>(false)
const datas = ref<Array<AccessLog>>([])
const total = ref<number>(0)

const pagination = reactive<Pagination>({
  page: 1,
  size: 10
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['url', 'httpMethod', 'params', 'body', 'ip', 'location', 'statusCode', 'responseTimes', 'responseMessage', 'operator'])
const columns = ref<Array<string>>(['url', 'httpMethod', 'params', 'body', 'ip', 'location', 'statusCode', 'responseTimes', 'responseMessage', 'operator'])

const filters = ref({
  url: null,
  statusCode: null
})

const detailLoading = ref<boolean>(false)
const initialValues: AccessLog = {
  id: undefined,
  url: '',
  httpMethod: '',
  ip: '',
  location: '',
  responseMessage: ''
}
const row = ref<AccessLog>({ ...initialValues })

const visible = ref<boolean>(false)
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
async function load() {
  loading.value = true
  retrieveAccessLogs(pagination, filters.value).then(res => {
    datas.value = res.data.content
    total.value = res.data.page.totalElements
  }).finally(() => { loading.value = false })
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  detailLoading.value = true
  fetchAccessLog(id).then(res => {
    row.value = res.data
  }).finally(() => { detailLoading.value = false })
}

/**
 * reset
 */
function reset() {
  filters.value = {
    url: null,
    statusCode: null
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
function showRow(id: number) {
  row.value = { ...initialValues }
  visible.value = true
  loadOne(id)
}

/**
 * 删除
 * @param id 主键
 */
function removeRow(id: number) {
  removeAccessLog(id).then(() => load())
}

/**
 * 确认
 * @param id 主键
 */
function confirmEvent(id: number) {
  if (id) {
    removeRow(id)
  }
}

/**
 * 全选操作
 * @param val 是否全选
 */
function handleCheckAllChange(val: CheckboxValueType) {
  checkedColumns.value = val ? columns.value : []
  isIndeterminate.value = false
}

/**
 * 选中操作
 * @param value 选中的值
 */
function handleCheckedChange(value: string[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === columns.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columns.value.length
}
</script>

<template>
  <ElSpace size="large" fill>
    <ElCard shadow="never">
      <ElForm inline :model="filters">
        <ElFormItem :label="$t('url')" prop="url">
          <ElInput v-model="filters.url" :placeholder="$t('inputText', { field: $t('url') })" />
        </ElFormItem>
        <ElFormItem :label="$t('statusCode')" prop="statusCode">
          <ElInput v-model="filters.statusCode" :placeholder="$t('inputText', { field: $t('statusCode') })" />
        </ElFormItem>
        <ElFormItem>
          <ElButton title="search" type="primary" @click="load">
            <div class="i-material-symbols:search-rounded" />{{ $t('search') }}
          </ElButton>
          <ElButton title="reset" @click="reset">
            <div class="i-material-symbols:replay-rounded" />{{ $t('reset') }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <ElRow :gutter="20" justify="space-between" class="mb-4">
        <ElCol :span="16" class="text-left">
          <ElButton title="clear" type="danger" plain>
            <div class="i-material-symbols:clear-all-rounded" />{{ $t('clear') }}
          </ElButton>
          <ElButton title="export" type="success" plain>
            <div class="i-material-symbols:file-export-outline-rounded" />{{ $t('export') }}
          </ElButton>
        </ElCol>

        <ElCol :span="8" class="text-right">
          <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
            <ElButton title="refresh" type="primary" plain circle @click="load">
              <div class="i-material-symbols:refresh-rounded" />
            </ElButton>
          </ElTooltip>

          <ElTooltip :content="$t('column') + $t('settings')" placement="top">
            <span class="inline-block ml-3 h-8">
              <ElPopover :width="200" trigger="click">
                <template #reference>
                  <ElButton title="settings" type="success" plain circle>
                    <div class="i-material-symbols:format-list-bulleted" />
                  </ElButton>
                </template>
                <div>
                  <ElCheckbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                    全选
                  </ElCheckbox>
                  <ElDivider />
                  <ElCheckboxGroup v-model="checkedColumns" @change="handleCheckedChange">
                    <draggable v-model="columns" item-key="simple">
                      <template #item="{ element }">
                        <div class="flex items-center space-x-2">
                          <div class="i-material-symbols:drag-indicator w-4 h-4 hover:cursor-move" />
                          <ElCheckbox :label="element" :value="element" :disabled="element === columns[0]">
                            <div class="inline-flex items-center space-x-4">
                              {{ $t(element) }}
                            </div>
                          </ElCheckbox>
                        </div>
                      </template>
                    </draggable>
                  </ElCheckboxGroup>
                </div>
              </ElPopover>
            </span>
          </ElTooltip>
        </ElCol>
      </ElRow>

      <ElTable v-loading="loading" :data="datas" row-key="id" stripe table-layout="auto">
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn type="index" :label="$t('no')" width="55" />
        <ElTableColumn prop="url" :label="$t('url')">
          <template #default="scope">
            <ElButton title="detail" type="primary" link @click="showRow(scope.row.id)">
              {{ scope.row.url }}
            </ElButton>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="httpMethod" :label="$t('httpMethod')">
          <template #default="scope">
            <ElBadge is-dot :type="httpMethods[scope.row.httpMethod]" class="mr-1" />{{ scope.row.httpMethod }}
          </template>
        </ElTableColumn>
        <ElTableColumn show-overflow-tooltip prop="params" :label="$t('params')" />
        <ElTableColumn show-overflow-tooltip prop="body" :label="$t('body')" />
        <ElTableColumn prop="ip" :label="$t('ip')" />
        <ElTableColumn show-overflow-tooltip prop="location" :label="$t('location')" />
        <ElTableColumn prop="statusCode" :label="$t('statusCode')">
          <template #default="scope">
            <ElTag v-if="scope.row.statusCode >= 200 && scope.row.statusCode < 300" type="success" round>
              {{ scope.row.statusCode }}
            </ElTag>
            <ElTag v-else-if="scope.row.statusCode >= 500" type="warning" round>
              {{ scope.row.statusCode }}
            </ElTag>
            <ElTag v-else type="danger" round>{{ scope.row.statusCode }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="responseTimes" :label="$t('responseTimes')">
          <template #default="scope">
            {{ formatDuration(scope.row.responseTimes) }}
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('actions')">
          <template #default="scope">
            <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
              <template #reference>
                <ElButton title="remove" size="small" type="danger" link>
                  <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
                </ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange" :total="total" />
    </ElCard>
  </ElSpace>

  <DialogView v-model="visible" show-close :title="$t('detail')">
    <ElDescriptions v-loading="detailLoading" border>
      <ElDescriptionsItem :label="$t('url')">{{ row.url }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('httpMethod')">
        <ElBadge is-dot :type="httpMethods[row.httpMethod as string]" />
        {{ row.httpMethod }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('params')">{{ row.params }}</ElDescriptionsItem>
      <ElDescriptionsItem v-if="row.body" :span="3" :label="$t('body')">{{ row.body }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('ip')">{{ row.ip }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('location')">{{ row.location }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('operator')">{{ row.operator }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('statusCode')">
        <ElTag v-if="row.statusCode && (row.statusCode >= 200 && row.statusCode < 300)" type="success" round>
          {{ row.statusCode }}
        </ElTag>
        <ElTag v-else-if="row.statusCode && row.statusCode >= 500" type="warning" round>
          {{ row.statusCode }}
        </ElTag>
        <ElTag v-else type="danger" round>{{ row.statusCode }}</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('responseTimes')">{{ row.responseTimes ? formatDuration(row.responseTimes) : '-' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('responseMessage')">{{ row.responseMessage }}</ElDescriptionsItem>
    </ElDescriptions>
  </DialogView>
</template>

<style lang="scss" scoped>
.el-badge {
  display: inline-flex;
  vertical-align: baseline;
}
</style>
