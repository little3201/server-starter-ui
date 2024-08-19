<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import draggable from 'vuedraggable'
import Dialog from 'components/Dialog.vue'
import { retrievePrivileges, retrievePrivilegeSubset, fetchPrivilege } from 'src/api/privileges'
import type { Privilege } from 'src/models'

const loading = ref<boolean>(false)
const datas = ref<Array<Privilege>>([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const checkAll = ref<boolean>(true)
const isIndeterminate = ref<boolean>(false)
const checkedColumns = ref<Array<string>>(['name', 'enabled', 'description'])
const columns = ref<Array<string>>(['name', 'enabled', 'description'])

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const searchForm = ref({
  name: null,
  path: null,
  component: null
})

const iconName = ref('')
const icons = ref([
  "gear",
  "user",
  "user-circle",
  "book",
  "lock-key",
  "key",
  "tree-structure",
  "test-tube",
  "database",
  "flask",
  "notepad",
  "file-upload",
  "file-cloud",
  "file-lock",
  "file-document-outline",
  "clipboard-text",
  "files"
]
)
const filterIcons = computed(() => icons.value.filter(item => item.includes(iconName.value)))

const formRef = ref<FormInstance>()

const oldComponent = ref<string>('#')
const form = ref<Privilege>({
  name: '',
  path: '',
  order: 1,
  component: '',
  redirect: '',
  icon: '',
  actions: [],
  description: ''
})

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

/**
 * 加载列表
 */
function load(row?: Privilege, treeNode?: unknown, resolve?: (date: Privilege[]) => void) {
  loading.value = true
  if (row && row.id && resolve) {
    retrievePrivilegeSubset(row.id).then(res => {
      resolve(res.data)
    }).finally(() => loading.value = false)
  } else {
    retrievePrivileges(pagination.page, pagination.size, searchForm.value).then(res => {
      let list = res.data.content
      list.forEach((element: Privilege) => {
        element.hasChildren = element.count && element.count > 0 ? true : false
      })
      datas.value = list
      pagination.total = res.data.totalElements
    }).finally(() => loading.value = false)
  }
}

/**
 * reset
 */
function reset() {
  searchForm.value = {
    name: null,
    path: null,
    component: null
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
function loadOne(id: number) {
  fetchPrivilege(id).then(res => {
    form.value = res.data
    oldComponent.value = res.data.component
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
 * expand 回调
 * @param row 数据行
 * @param expanded 是否展开
 */
function expandChange(row: Privilege, expanded: boolean) {
  console.log("row: ", row)
  console.log("expanded: ", expanded)
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
          <ElFormItem :label="$t('path')" prop="path">
            <ElInput v-model="searchForm.path" :placeholder="$t('inputText') + $t('path')" />
          </ElFormItem>
          <ElFormItem :label="$t('component')" prop="component">
            <ElInput v-model="searchForm.component" :placeholder="$t('inputText') + $t('component')" />
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
                <div class="i-mdi:refresh" />
              </ElButton>
            </ElTooltip>

            <ElTooltip :content="$t('column') + $t('settings')" placement="top">
              <span class="inline-block ml-3 h-8">
                <ElPopover :width="200" trigger="click">
                  <template #reference>
                    <ElButton type="success" plain circle>
                      <div class="i-mdi:format-list-bulleted" />
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
                            <div class="i-mdi:drag w-4 h-4 hover:cursor-move" />
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

        <ElTable v-loading="loading" :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto"
          @expand-change="expandChange">
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn prop="name" :label="$t('name')" class-name="name-cell">
            <template #default="scope">
              <div :class="scope.row.icon" class="inline-block mr-2" />
              {{ $t(scope.row.name) }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="path" :label="$t('path')" />
          <ElTableColumn prop="component" :label="$t('component')" />
          <ElTableColumn prop="redirect" :label="$t('redirect')" />
          <ElTableColumn prop="hidden" :label="$t('hidden')" />
          <ElTableColumn prop="order" :label="$t('order')" />
          <ElTableColumn prop="enabled" :label="$t('enabled')">
            <template #default="scope">
              <ElSwitch size="small" v-model="scope.row.enabled"
                style="--el-switch-on-color: var(--el-color-success);" />
            </template>
          </ElTableColumn>
          <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
          <ElTableColumn :label="$t('actions')">
            <template #default="scope">
              <ElButton size="small" type="primary" link @click="editRow(scope.row.id)">
                <div class="i-mdi:pencil-outline" />{{ $t('edit') }}
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <ElPagination layout="prev, pager, next, sizes, jumper, ->, total" @change="pageChange"
          :total="pagination.total" />
      </ElCard>
    </ElSpace>

    <Dialog v-model="dialogVisible" :title="$t('privileges')" width="36%">
      <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('name')" prop="name">
              <ElInput v-model="form.name" :placeholder="$t('inputText') + $t('name')" disabled />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('path')" prop="path">
              <ElInput v-model="form.path" :placeholder="$t('inputText') + $t('path')" disabled />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol :span="12">
            <ElFormItem :label="$t('component')" prop="component">
              <ElInput v-model="form.component" :placeholder="$t('inputText') + $t('component')" disabled />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem :label="$t('order')" prop="order">
              <ElInputNumber v-model="form.order" :placeholder="$t('inputText') + $t('order')" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol>
            <ElFormItem :label="$t('icon')" prop="meta.icon">
              <!-- width 相对body设置, popover默认设置了 position: absolute -->
              <ElPopover trigger="click" width="36%">
                <template #reference>
                  <ElInput v-model="form.icon" :placeholder="$t('inputText') + $t('icon')">
                    <template #prefix>
                      <div :class="form.icon" />
                    </template>
                  </ElInput>
                </template>
                <ElInput v-model="iconName" :placeholder="$t('inputText') + $t('icon')">
                </ElInput>
                <div class="flex flex-wrap max-h-48 overflow-y-scroll mt-4">
                  <div v-for="(icon, index) in filterIcons" :key="index" @click="form.icon = ('ph:' + icon)" :class="['inline-flex items-center cursor-pointer w-1/3 h-8 hover:text-[var(--el-color-primary)]',
                    { 'text-[var(--el-color-primary)': form.icon === ('ph:' + icon) }]">
                    <div :class="['w-5 h-5', 'i-mdi:' + icon]" />
                    <span class="ml-2 text-base">{{ icon }}</span>
                  </div>
                </div>
              </ElPopover>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="w-full !mx-0">
          <ElCol>
            <ElFormItem :label="$t('actions')" prop="meta.actions">
              <!-- width 相对body设置, popover默认设置了 position: absolute -->
              <ElSelect multiple v-model="form.actions" :placeholder="$t('selectText') + $t('actions')">
                <ElOption value="add">{{ $t('add') }}</ElOption>
                <ElOption value="edit">{{ $t('edit') }}</ElOption>
                <ElOption value="remove">{{ $t('remove') }}</ElOption>
                <ElOption value="import">{{ $t('import') }}</ElOption>
                <ElOption value="export">{{ $t('export') }}</ElOption>
              </ElSelect>
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
        <ElButton @click="dialogVisible = false">
          <div class="i-mdi:close" />{{ $t('cancel') }}
        </ElButton>
        <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
          <div class="i-mdi:check-circle-outline" /> {{ $t('submit') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss">
.name-cell {
  .cell {
    display: inline-flex;
    align-items: center;
  }
}
</style>