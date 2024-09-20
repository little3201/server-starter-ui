<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Dialog from 'components/Dialog.vue'
import { retrieveScripts, fetchScript } from 'src/api/scripts'
import type { Script } from 'src/models'
import { ElImage } from 'element-plus'


const loading = ref<boolean>(false)
const datas = ref<Array<Script>>([])

const rowLoading = ref<boolean>(false)
const row = ref<Script>({
  id: undefined,
  name: '',
  icon: '',
  version: '',
  description: ''
})

const dialogVisible = ref<boolean>(false)

/**
 * 加载列表
 */
async function load() {
  loading.value = true
  retrieveScripts().then(res => {
    datas.value = res.data
  }).finally(() => loading.value = false)
}

/**
 * 加载
 * @param id 主键
 */
async function loadOne(id: number) {
  rowLoading.value = true
  fetchScript(id).then(res => {
    row.value = res.data
  }).finally(() => rowLoading.value = false)
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
}

/**
 * 选中操作
 * @param value 选中的值
 */
function handleCheckedChange(value: string[]) {
}
</script>

<template>
  <ElSpace size="large" fill>
    <ElCard shadow="never">
      <ElRow :gutter="20" justify="space-between">
        <ElCol :span="16" class="text-left">
          <ElButton type="primary">
            <div class="i-material-symbols:add-rounded" />{{ $t('add') }}
          </ElButton>
          <ElButton type="danger" plain>
            <div class="i-material-symbols:delete-outline-rounded" />{{ $t('remove') }}
          </ElButton>
          <ElButton type="success" plain @click="dialogVisible = true">
            <div class="i-material-symbols:rule-settings-rounded" />{{ $t('config') }}
          </ElButton>
        </ElCol>

        <ElCol :span="8" class="text-right">
          <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
            <ElButton type="primary" plain circle @click="load">
              <div class="i-material-symbols:refresh-rounded" />
            </ElButton>
          </ElTooltip>
        </ElCol>
      </ElRow>
    </ElCard>

    <ElRow :gutter="16">
      <ElCol :span="6" v-for="row in datas" :key="row.id" class="mb-4">
        <ElCard shadow="hover" class="text-center cursor-pointer">
          <ElImage :src="row.icon" />
          <div class="mt-2">
            <span class="text-[var(--el-text-color-regular)]">{{ row.name }}: {{ row.version }}</span><br />
            <span class="text-sm text-[var(--el-text-color-secondary)]">{{ row.description }}</span>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </ElSpace>

  <Dialog v-model="dialogVisible" :title="$t('detail')">
    <ElDescriptions v-loading="rowLoading">
      <ElDescriptionsItem :label="$t('name')">{{ row.name }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('icon')">{{ row.icon }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('description')">{{ row.description }}</ElDescriptionsItem>
    </ElDescriptions>
  </Dialog>
</template>
