<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { UploadInstance, CheckboxValueType } from 'element-plus'
import draggable from 'vuedraggable'
import DialogView from 'components/DialogView.vue'
import { dayjs } from 'element-plus'
import { retrieveFiles, fetchFile } from 'src/api/files'
import type { Pagination, FileRecord } from 'src/types'
import { formatFileSize } from 'src/utils'

const loading = ref<boolean>(false)
const uploadLoading = ref<boolean>(false)

const datas = ref<Array<FileRecord>>([])
const total = ref<number>(0)

const pagination = reactive<Pagination>({
  page: 1,
  size: 10
})

const visible = ref<boolean>(false)

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'type', 'size'])
const columns = ref<Array<string>>(['name', 'type', 'size'])

const uploadRef = ref<UploadInstance>()

const filters = ref({
  name: null
})

/**
 * 分页变化
 * @param value 当前页码
 */
function pageChange(currentPage: number, pageSize: number) {
  pagination.page = currentPage
  pagination.size = pageSize
  load()
}

// 排序变化处理
function handleSortChange(data: { prop: string, order: string }) {
  pagination.sortBy = data.prop
  pagination.descending = data.order === 'descending'
  load()
}

/**
 * 加载列表
 */
async function load() {
  loading.value = true
  retrieveFiles(pagination, filters.value).then(res => {
    datas.value = res.data.content
    total.value = res.data.page.totalElements
  }).finally(() => { loading.value = false })
}

/**
 * reset
 */
function reset() {
  filters.value = {
    name: null
  }
  load()
}

onMounted(() => {
  load()
})

/**
 * 上传
 */
function uploadRow() {
  visible.value = true
}

/**
 * 下载
 * @param id 主键
 */
function downloadRow(id: number) {
  fetchFile(id).then(res => {
    console.log(res.data)
  })
}

/**
 * 提交
 */
function onSubmit(uploadEl: UploadInstance | undefined) {
  if (!uploadEl) return
  uploadLoading.value = true
}

/**
 * 删除
 * @param id 主键
 */
function removeRow(id: number) {
  datas.value = datas.value.filter(item => item.id !== id)
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
  <div>
    <ElSpace size="large" fill>
      <ElCard shadow="never">
        <ElForm inline :model="filters">
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="filters.name" :placeholder="$t('inputText', { field: $t('name') })" />
          </ElFormItem>
          <ElFormItem>
            <ElButton title="search" type="primary" @click="load">
              <div class="icon-[material-symbols--search-rounded]" />{{ $t('search') }}
            </ElButton>
            <ElButton title="reset" @click="reset">
              <div class="icon-[material-symbols--replay-rounded]" />{{ $t('reset') }}
            </ElButton>
          </ElFormItem>
        </ElForm>
      </ElCard>

      <ElCard shadow="never">
        <ElRow :gutter="20" justify="space-between" class="mb-4">
          <ElCol :span="16" class="text-left">
            <ElButton title="upload" type="primary" plain @click="uploadRow">
              <div class="icon-[material-symbols--upload" />{{ $t('upload') }}
            </ElButton>
          </ElCol>

          <ElCol :span="8" class="text-right">
            <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
              <ElButton title="refresh" type="primary" plain circle @click="load">
                <div class="icon-[material-symbols--refresh-rounded]" />
              </ElButton>
            </ElTooltip>

            <ElTooltip :content="$t('column') + $t('settings')" placement="top">
              <span class="inline-block ml-3 h-8">
                <ElPopover :width="200" trigger="click">
                  <template #reference>
                    <ElButton title="settings" type="success" plain circle>
                      <div class="icon-[material-symbols--format-list-bulleted" />
                    </ElButton>
                  </template>
                  <div>
                    <ElCheckbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                      {{ $t('all') }}
                    </ElCheckbox>
                    <ElDivider />
                    <ElCheckboxGroup v-model="checkedColumns" @change="handleCheckedChange">
                      <draggable v-model="columns" item-key="simple">
                        <template #item="{ element }">
                          <div class="flex items-center space-x-2">
                            <div class="icon-[material-symbols--drag-indicator w-4 h-4 hover:cursor-move" />
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

        <ElTable v-loading="loading" :data="datas" row-key="id" stripe table-layout="auto"
          @sort-change="handleSortChange">
          <ElTableColumn type="index" :label="$t('no')" width="55" />
          <ElTableColumn prop="name" :label="$t('name')" />
          <ElTableColumn prop="type" :label="$t('type')" />
          <ElTableColumn prop="size" :label="$t('size')" sortable="custom">
            <template #default="scope">
              {{ formatFileSize(scope.row.size) }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="lastModifiedDate" :label="$t('lastModifiedDate')">
            <template #default="scope">
              {{ dayjs(scope.row.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('actions')">
            <template #default="scope">
              <ElButton title="download" size="small" type="success" link @click="downloadRow(scope.row.id)">
                <div class="icon-[material-symbols--download" />{{ $t('download') }}
              </ElButton>
              <ElPopconfirm :title="$t('removeConfirm')" :width="240" @confirm="confirmEvent(scope.row.id)">
                <template #reference>
                  <ElButton title="remove" size="small" type="danger" link>
                    <div class="icon-[material-symbols--delete-outline-rounded]" />{{ $t('remove') }}
                  </ElButton>
                </template>
              </ElPopconfirm>
            </template>
          </ElTableColumn>
        </ElTable>
        <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange" :total="total" />
      </ElCard>
    </ElSpace>

    <DialogView v-model="visible" :title="$t('upload')" width="35%">
      <ElUpload ref="uploadRef" :limit="1" drag action="/api/files/upload">
        <div class="el-icon--upload inline-flex justify-center">
          <div class="icon-[material-symbols--upload-rounded]" />
        </div>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            file with a size less than 50mb
          </div>
        </template>
      </ElUpload>
      <template #footer>
        <ElButton title="cancel" @click="visible = false">
          <div class="icon-[material-symbols--close" />{{ $t('cancel') }}
        </ElButton>
        <ElButton title="submit" type="primary" :loading="uploadLoading" @click="onSubmit(uploadRef)">
          <div class="icon-[material-symbols--check-circle-outline-rounded]" /> {{ $t('submit') }}
        </ElButton>
      </template>
    </DialogView>
  </div>
</template>
