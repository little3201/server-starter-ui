<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import draggable from 'vuedraggable'
import Dialog from 'components/Dialog.vue'
import Preview from './preview.vue'
import { retrieveTables, retrieveTableColumns, retrieveTableCodes, fetchTable } from 'src/api/tables'
import type { Table, Column, Code } from 'src/models'

const loading = ref<boolean>(false)
const datas = ref<Array<Table>>([])
const columnDatas = ref<Array<Column>>([])
const codeDatas = ref<Array<Code>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'description'])
const columns = ref<Array<string>>(['name', 'description'])

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const configLoading = ref<boolean>(false)
const configDialogVisible = ref<boolean>(false)

const previewDialogVisible = ref<boolean>(false)

const searchForm = ref({
  name: null
})

const formRef = ref<FormInstance>()
const form = ref<Table>({
  name: '',
  comment: '',
  description: ''
})

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ]
})

const fieldTypeOptions = [
  { label: 'String', value: 1 },
  { label: 'Integer', value: 2 },
  { label: 'Long', value: 3 },
  { label: 'Double', value: 4 },
  { label: 'LocaleDate', value: 5 },
  { label: 'LocaleDateTime', value: 6 }
]

const showTypeOptions = [
  { label: '文本框', value: 1 },
  { label: '下拉框', value: 2 },
  { label: '文本域', value: 3 }
]

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
async function load() {
  loading.value = true
  retrieveTables(pagination.page, pagination.size, searchForm.value).then(res => {
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
 * config
 * @param id 主键
 */
function configRow(id: number) {
  configDialogVisible.value = true
  retrieveTableColumns(id).then(res => {
    columnDatas.value = res.data
  })
}

/**
 * preview
 * @param id 主键
 */
function previewRow(id: number) {
  previewDialogVisible.value = true
  retrieveTableCodes(id).then(res => {
    codeDatas.value = res.data
  })
}

/**
 * 弹出框
 * @param id 主键
 */
function editRow(id?: number) {
  if (id) {
    loadOne(id)
  }
  dialogVisible.value = true
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  fetchTable(id).then(res => {
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
  <ElSpace size="large" fill>
    <ElCard shadow="never" class="search">
      <ElForm inline :model="searchForm" @submit.prevent>
        <ElFormItem :label="$t('name')" prop="name">
          <ElInput v-model="searchForm.name" :placeholder="$t('inputText') + $t('name')" />
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
          <ElButton type="primary" @click="editRow()">
            <div class="i-material-symbols:add-rounded" />{{ $t('add') }}
          </ElButton>
          <ElButton type="danger" plain>
            <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
          </ElButton>
          <ElButton type="warning" plain @click="dialogVisible = true">
            <div class="i-material-symbols:upload-file-outline-rounded" />{{ $t('import') }}
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

      <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto">
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn type="index" :label="$t('no')" width="55" />
        <ElTableColumn prop="name" :label="$t('name')" />
        <ElTableColumn prop="comment" :label="$t('comment')" />
        <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
        <ElTableColumn :label="$t('actions')">
          <template #default="scope">
            <ElButton size="small" type="primary" link @click="editRow(scope.row.id)">
              <div class="i-material-symbols:edit-outline-rounded" />{{ $t('edit') }}
            </ElButton>
            <ElButton size="small" type="primary" link @click="configRow(scope.row.id)">
              <div class="i-material-symbols:rule-settings-rounded" />{{ $t('config') }}
            </ElButton>
            <ElButton size="small" type="primary" link @click="previewRow(scope.row.id)">
              <div class="i-material-symbols:visibility-outline-rounded" />{{ $t('preview') }}
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

  <!-- add or edit -->
  <Dialog v-model="dialogVisible" :title="$t('generator')" width="35%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol :span="12">
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="form.name" :placeholder="$t('inputText') + $t('name')" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem :label="$t('comment')" prop="comment">
            <ElInput v-model="form.comment" :placeholder="$t('inputText') + $t('comment')" />
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
        <div class="i-material-symbols:close" />{{ $t('cancel') }}
      </ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
        <div class="i-material-symbols:check-circle-outline-rounded" /> {{ $t('submit') }}
      </ElButton>
    </template>
  </Dialog>

  <!-- config -->
  <Dialog v-model="configDialogVisible" :title="$t('config')" width="85%" :max-height="600">
    <ElTable v-loading="configLoading" :data="columnDatas" row-key="id" stripe table-layout="auto">
      <ElTableColumn type="selection" width="55" />
      <ElTableColumn type="index" :label="$t('no')" width="55" />
      <ElTableColumn prop="name" :label="$t('name')" />
      <ElTableColumn prop="type" :label="$t('type')" />
      <ElTableColumn prop="length" :label="$t('length')" />
      <ElTableColumn prop="fieldType" :label="$t('fieldType')">
        <template #default="scope">
          <el-select v-model="scope.row.fieldType">
            <el-option v-for="item in fieldTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="nullable" :label="$t('nullable')">
        <template #default="scope">
          <ElCheckbox v-model="scope.row.nullable" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="unique" :label="$t('unique')">
        <template #default="scope">
          <ElCheckbox v-model="scope.row.unique" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="showType" :label="$t('showType')">
        <template #default="scope">
          <el-select v-model="scope.row.showType">
            <el-option v-for="item in showTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="comment" :label="$t('comment')" />
      <ElTableColumn prop="queryable" :label="$t('queryable')">
        <template #default="scope">
          <ElCheckbox v-model="scope.row.queryable" />
        </template>
      </ElTableColumn>
    </ElTable>
    <template #footer>
      <ElButton @click="configDialogVisible = false">
        <div class="i-material-symbols:close" />{{ $t('cancel') }}
      </ElButton>
      <ElButton type="primary" :loading="configLoading" @click="onSubmit">
        <div class="i-material-symbols:check-circle-outline-rounded" /> {{ $t('submit') }}
      </ElButton>
    </template>
  </Dialog>

  <!-- preview -->
  <Dialog v-model="previewDialogVisible" :title="$t('config')" width="85%" :max-height="600">
    <Preview :codes="codeDatas" />
  </Dialog>
</template>
