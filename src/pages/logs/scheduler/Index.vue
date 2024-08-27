<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { dayjs } from 'element-plus'
import draggable from 'vuedraggable'
import { retrieveSchedulerLogs, fetchSchedulerLog } from 'src/api/scheduler-logs'
import type { SchedulerLog } from 'src/models'


const loading = ref<boolean>(false)
const datas = ref<Array<SchedulerLog>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'status', 'description'])
const columns = ref<Array<string>>(['name', 'status', 'description'])

const searchForm = ref({
  name: null,
  method: null
})

const detailLoading = ref<boolean>(false)
const detail = ref<SchedulerLog>({
  id: undefined,
  name: "",
  method: "",
  params: "",
  cronExpression: "",
  startTime: "",
  endTime: "",
  status: null
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
async function load() {
  retrieveSchedulerLogs(pagination.page, pagination.size).then(res => {
    datas.value = res.data.content
    pagination.total = res.data.totalElements
  }).finally(() => loading.value = false)
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  detailLoading.value = true
  fetchSchedulerLog(id).then(res => {
    detail.value = res.data
  }).finally(() => detailLoading.value = false)
}

/**
 * reset
 */
function reset() {
  searchForm.value = {
    name: null,
    method: null
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

/**
 * 全选操作
 * @param val 是否全选
 */
function handleCheckAllChange(val: boolean) {
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
  <div>
    <ElSpace size="large" fill>
      <ElCard shadow="never" class="search">
        <ElForm inline :model="searchForm">
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="searchForm.name" :placeholder="$t('inputText') + $t('name')" />
          </ElFormItem>
          <ElFormItem :label="$t('method')" prop="method">
            <ElInput v-model="searchForm.method" :placeholder="$t('inputText') + $t('method')" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="load">
              <div class="i-material-symbols:search-rounded" />{{ $t('search') }}
            </ElButton>
            <ElButton @click="reset">
              <div class="i-material-symbols:replay-rounded" />{{ $t('reset') }}
            </ElButton>
          </ElFormItem>
        </ElForm>
      </ElCard>

      <ElCard shadow="never">
        <ElRow :gutter="20" justify="space-between" class="mb-4">
          <ElCol :span="16" class="text-left">
            <ElButton type="danger" plain>
              <div class="i-material-symbols:delete-outline-rounded" />{{ $t('clear') }}
            </ElButton>
            <ElButton type="success" plain>
              <div class="i-material-symbols:file-save-outline-rounded" />{{ $t('export') }}
            </ElButton>
          </ElCol>

          <ElCol :span="8" class="text-right">
            <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
              <ElButton type="primary" plain circle @click="load">
                <div class="i-material-symbols:refresh-rounded" />
              </ElButton>
            </ElTooltip>

            <ElTooltip :content="$t('column') + $t('settings')" placement="top">
              <span class="inline-block ml-3 h-8">
                <ElPopover :width="200" trigger="click">
                  <template #reference>
                    <ElButton type="success" plain circle>
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

        <ElTable :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto">
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn type="index" :label="$t('no')" width="55" />
          <ElTableColumn prop="name" :label="$t('name')" />
          <ElTableColumn prop="method" :label="$t('method')" />
          <ElTableColumn prop="params" :label="$t('params')" />
          <ElTableColumn prop="cronExpression" :label="$t('cronExpression')" />
          <ElTableColumn prop="status" :label="$t('status')">
            <template #default="scope">
              <ElTag v-if="scope.row.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
              <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="startTime" :label="$t('startTime')">
            <template #default="scope">
              {{ dayjs(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="endTime" :label="$t('endTime')">
            <template #default="scope">
              {{ dayjs(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('actions')" width="160">
            <template #default="scope">
              <ElButton size="small" type="success" link @click="showRow(scope.row.id)">
                <div class="i-material-symbols:sticky-note-outline-rounded" />{{ $t('detail') }}
              </ElButton>
              <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
                <template #reference>
                  <ElButton size="small" type="danger" link>
                    <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
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
        <ElDescriptionsItem :label="$t('name')">{{ detail.name }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('method')">{{ detail.method }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('params')">{{ detail.params }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('cronExpression')">{{ detail.cronExpression }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('startTime')">{{ dayjs(detail.startTime).format('YYYY-MM-DD HH:mm:ss') }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('endTime')">{{ dayjs(detail.endTime).format('YYYY-MM-DD HH:mm:ss') }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('enabled')">
          <ElTag v-if="detail.status === 1" type="success" effect="light" round>{{ $t('success') }}</ElTag>
          <ElTag v-else type="danger" effect="light" round>{{ $t('failure') }}</ElTag>
        </ElDescriptionsItem>
      </ElDescriptions>
    </Dialog>
  </div>
</template>
