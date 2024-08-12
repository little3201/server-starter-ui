<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Dialog from 'components/Dialog.vue'
import { retrieveDictionarySubset, fetchDictionary } from '~/api/dictionaries'
import type { Dictionary } from '~/models'

const props = defineProps<{
  superiorId: number,
  title: string
}>()

const loading = ref<boolean>(false)
const datas = ref<Array<Dictionary>>([])

const saveLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const formRef = ref<FormInstance>()
const form = ref<Dictionary>({
  name: '',
  superiorId: props.superiorId,
  order: 1,
  children: [],
})

const rules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, trigger: 'blur' }
  ]
})

/**
 * 加载列表
 */
function load() {
  loading.value = true
  retrieveDictionarySubset(props.superiorId).then(res => {
    datas.value = res.data
  }).finally(() => loading.value = false)
}

onMounted(() => {
  load()
})

/**
 * 弹出框
 * @param id 主键
 */
function saveOrUpdate(id?: number) {
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
  fetchDictionary(id).then(res => {
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
  <ElCard shadow="never">
    <ElRow :gutter="20" justify="end" align="middle" class="mb-4">
      <ElCol :span="12" class="text-left">
        <span class="text-xl">{{ title }}</span>
      </ElCol>
      <ElCol :span="12" class="text-right">
        <ElButton type="primary" @click="saveOrUpdate()">
          <div class="i-ph:plus" />{{ $t('add') }}
        </ElButton>
        <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
          <ElButton type="primary" plain circle @click="load">
            <template #icon>
              <div class="i-ph:arrow-clockwise" />
            </template>
          </ElButton>
        </ElTooltip>
      </ElCol>
    </ElRow>

    <ElTable v-loading="loading" :data="datas" lazy :load="load" title="sss" row-key="id" stripe table-layout="auto">
      <ElTableColumn type="selection" width="55" />
      <ElTableColumn prop="name" :label="$t('name')" />
      <ElTableColumn prop="enabled" :label="$t('status')">
        <template #default="scope">
          <ElSwitch size="small" v-model="scope.row.enabled" style="--el-switch-on-color: var(--el-color-success);" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="order" :label="$t('order')" />
      <ElTableColumn show-overflow-tooltip prop="description" :label="$t('description')" />
      <ElTableColumn :label="$t('actions')">
        <template #default="scope">
          <ElButton size="small" type="primary" link @click="saveOrUpdate(scope.row.id)">
            <div class="i-ph:pencil-simple-line" />{{ $t('edit') }}
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
  </ElCard>

  <Dialog v-model="dialogVisible" :title="$t('dictionary')" width="25%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElRow :gutter="20" class="w-full !mx-0">
        <ElCol :span="12">
          <ElFormItem :label="$t('name')" prop="name">
            <ElInput v-model="form.name" :placeholder="$t('inputText') + $t('name')" />
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
          <ElFormItem :label="$t('description')" prop="description">
            <ElInput v-model="form.description" type="textarea" :placeholder="$t('inputText') + $t('description')" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">
        <div class="i-ph:x-circle" />{{ $t('cancle') }}
      </ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="onSubmit">
        <div class="i-ph:check-circle" /> {{ $t('commit') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.el-card {
  border: none !important;
}
</style>