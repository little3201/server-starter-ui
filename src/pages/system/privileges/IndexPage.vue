<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules, UploadInstance, CheckboxValueType } from 'element-plus'
import draggable from 'vuedraggable'
import DialogView from 'components/DialogView.vue'
import {
  retrievePrivileges, retrievePrivilegeSubset,
  fetchPrivilege, modifyPrivilege, enablePrivilege
} from 'src/api/privileges'
import { retrieveDictionarySubset } from 'src/api/dictionaries'
import { visibleArray } from 'src/utils'
import { actions } from 'src/constants'
import type { Pagination, Privilege, Dictionary } from 'src/types'

const loading = ref<boolean>(false)
const datas = ref<Array<Privilege>>([])
const total = ref<number>(0)

const pagination = reactive<Pagination>({
  page: 1,
  size: 10
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'enabled', 'description'])
const columns = ref<Array<string>>(['name', 'enabled', 'description'])

const buttonOptions = ref<Array<Dictionary>>([])
const saveLoading = ref<boolean>(false)
const visible = ref<boolean>(false)

const importVisible = ref<boolean>(false)
const importLoading = ref<boolean>(false)
const importRef = ref<UploadInstance>()

const filters = ref({
  name: null,
  path: null
})

const oldComponent = ref<string>('#')

const formRef = ref<FormInstance>()
const initialValues: Privilege = {
  id: undefined,
  name: '',
  path: '',
  component: '',
  icon: ''
}
const form = ref<Privilege>({ ...initialValues })

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ],
  path: [
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

async function load(row?: Privilege, treeNode?: unknown, resolve?: (date: Privilege[]) => void) {
  loading.value = true
  if (row && row.id && resolve) {
    retrievePrivilegeSubset(row.id).then(res => {
      const list = res.data
      // 处理字节点
      list.forEach((element: Privilege) => {
        if (element.count && element.count > 0) {
          element.hasChildren = true
        }
      })
      resolve(list)
    }).finally(() => { loading.value = false })
  } else {
    retrievePrivileges(pagination, filters.value).then(res => {
      const list = res.data.content
      // 处理字节点
      list.forEach((element: Privilege) => {
        if (element.count && element.count > 0) {
          element.hasChildren = true
        }
      })
      datas.value = list
      total.value = res.data.page.totalElements
    }).finally(() => { loading.value = false })
  }
}

async function loadDictionaries() {
  retrieveDictionarySubset(42).then(res => {
    buttonOptions.value = res.data
  })
}

/**
 * reset
 */
function reset() {
  filters.value = {
    name: null,
    path: null
  }
  load()
}

onMounted(() => {
  load()
})

/**
 * 导入
 */
function importRows() {
  importVisible.value = true
}

/**
 * 弹出框
 * @param id 主键
 */
function saveRow(id?: number) {
  form.value = { ...initialValues }
  if (id) {
    loadOne(id)
  }
  loadDictionaries()
  visible.value = true
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  fetchPrivilege(id).then(res => {
    form.value = res.data
    oldComponent.value = res.data.component
  })
}

async function enableChange(id: number) {
  enablePrivilege(id).then(() => { load() })
}

/**
 * 表单提交
 */
async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      saveLoading.value = true
      if (form.value.id) {
        modifyPrivilege(form.value.id, form.value).then(res => {
          load(res.data)
          visible.value = false
        }).finally(() => { saveLoading.value = false })
      }
    }
  })
}

/**
 * 表单提交
 */
async function onImportSubmit(importEl: UploadInstance | undefined) {
  if (!importEl) return

  importLoading.value = true
}

/**
 * handle check change
 * @param item checked item
 */
function onCheckChange(item: string) {
  if (form.value.actions) {
    const index = form.value.actions.indexOf(item)
    if (index === -1) {
      form.value.actions.push(item)
    } else {
      form.value.actions.splice(index, 1)
    }
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
        <ElFormItem :label="$t('name')" prop="name">
          <ElInput v-model="filters.name" :placeholder="$t('inputText', { field: $t('name') })" />
        </ElFormItem>
        <ElFormItem :label="$t('path')" prop="path">
          <ElInput v-model="filters.path" :placeholder="$t('inputText', { field: $t('path') })" />
        </ElFormItem>
        <ElFormItem>
          <ElButton title="search" type="primary" @click="load()">
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
          <ElButton title="import" type="warning" plain @click="importRows">
            <div class="icon-[material-symbols--database-upload-outline-rounded]" />{{ $t('import') }}
          </ElButton>
          <ElButton title="export" type="success" plain>
            <div class="icon-[material-symbols--file-export-outline-rounded]" />{{ $t('export') }}
          </ElButton>
        </ElCol>
        <ElCol :span="8" class="text-right">
          <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
            <ElButton title="refresh" type="primary" plain circle @click="load()">
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
                          <div class="icon-[material-symbols--drag w-4 h-4 hover:cursor-move" />
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
        <ElTableColumn prop="name" :label="$t('name')" class-name="name-cell">
          <template #default="scope">
            <div :class="['inline-block mr-2', `icon-[material-symbols--${scope.row.icon}-rounded]`]" />
            {{ $t(scope.row.name) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="path" :label="$t('path')" />
        <ElTableColumn prop="redirect" :label="$t('redirect')" />
        <ElTableColumn prop="actions" :label="$t('actions')">
          <template #default="scope">
            <template v-if="scope.row.actions && scope.row.actions.length > 0">
              <ElTag v-for="(item, index) in visibleArray(scope.row.actions, 3)" :key="index" :type="actions[item]"
                class="mr-2">
                {{ $t(item as string) }}
              </ElTag>
              <ElPopover v-if="scope.row.actions.length > 3" placement="top-start" trigger="hover">
                <template #reference>
                  <ElTag type="primary">
                    +{{ scope.row.actions.length - 3 }}
                  </ElTag>
                </template>
                <ElTag v-for="(item, index) in scope.row.actions.slice(3)" :key="index" :type="actions[item]"
                  class="mb-2 mr-2">
                  {{ $t(item) }}
                </ElTag>
              </ElPopover>
            </template>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="enabled" :label="$t('enabled')">
          <template #default="scope">
            <ElSwitch size="small" v-model="scope.row.enabled" @change="enableChange(scope.row.id)"
              style="--el-switch-on-color: var(--el-color-success);" />
          </template>
        </ElTableColumn>
        <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
        <ElTableColumn :label="$t('actions')">
          <template #default="scope">
            <ElButton title="modify" size="small" type="primary" link @click="saveRow(scope.row.id)">
              <div class="icon-[material-symbols--edit-outline-rounded]" />{{ $t('modify') }}
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange" :total="total" />
    </ElCard>
  </ElSpace>

  <DialogView v-model="visible" :title="$t('privileges')" width="36%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol :span="12">
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="form.name" :placeholder="$t('inputText', { field: $t('name') })" disabled>
              <template #prefix>
                <div :class="form.icon" />
              </template>
            </ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem :label="$t('path')" prop="path">
            <ElInput v-model="form.path" :placeholder="$t('inputText', { field: $t('path') })" disabled />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol :span="12">
          <ElFormItem :label="$t('component')" prop="component">
            <ElInput v-model="form.component" :placeholder="$t('inputText', { field: $t('component') })" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem :label="$t('redirect')" prop="redirect">
            <ElInput v-model="form.redirect" :placeholder="$t('inputText', { field: $t('redirect') })"
              :disabled="!!form.superiorId" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol>
          <ElFormItem :label="$t('actions')" prop="meta.actions">
            <ElCheckTag v-for="item in buttonOptions" :key="item.id" :checked="form.actions?.includes(item.name)"
              :type="actions[item.name]" class="mr-2 mb-2" @change="onCheckChange(item.name)">
              {{ $t(item.name) }}
            </ElCheckTag>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol>
          <ElFormItem :label="$t('description')" prop="description">
            <ElInput v-model="form.description" type="textarea" :placeholder="$t('description')" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton title="cancel" @click="visible = false">
        <div class="icon-[material-symbols--close" />{{ $t('cancel') }}
      </ElButton>
      <ElButton title="submit" type="primary" :loading="saveLoading" @click="onSubmit(formRef)">
        <div class="icon-[material-symbols--check-circle-outline-rounded]" /> {{ $t('submit') }}
      </ElButton>
    </template>
  </DialogView>

  <!-- import -->
  <DialogView v-model="importVisible" :title="$t('import')" width="36%">
    <p>模版下载：<a :href="`templates/equipments.xlsx`" download="仪器设备模版.xlsx">仪器设备模版.xlsx</a></p>
    <ElUpload ref="importRef" :limit="1" drag action="/api/privileges/import"
      accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
      <div class="el-icon--upload inline-flex justify-center">
        <div class="icon-[material-symbols--upload-rounded]" />
      </div>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          File with a size less than 50MB.
        </div>
      </template>
    </ElUpload>
    <p class="text-red">xxxx</p>
    <template #footer>
      <ElButton title="cancel" @click="importVisible = false">
        <div class="icon-[material-symbols--close" />{{ $t('cancel') }}
      </ElButton>
      <ElButton title="submit" type="primary" :loading="importLoading" @click="onImportSubmit(importRef)">
        <div class="icon-[material-symbols--check-circle-outline-rounded]" /> {{ $t('submit') }}
      </ElButton>
    </template>
  </DialogView>
</template>

<style lang="scss">
.name-cell {
  .cell {
    display: inline-flex;
    align-items: center;
  }
}
</style>

<style lang="scss" scoped>
.el-badge {
  display: inline-flex;
  vertical-align: baseline;
}
</style>
