<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { retrieveLogs } from '~/api/logs'
import type { Log } from '~/api/models.type'

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})
const datas = ref<Array<Log>>([])
const searchFormRef = ref()

const searchForm = ref({
  title: ''
})

function load() {
  retrieveLogs(1, 10).then(res => {
    datas.value = res.data.content
    pagination.total = res.data.totalElements
  })
}

onMounted(() => {
  load()
})
</script>

<template>
  <ElSpace size="large" fill>
    <ElCard shadow="never" class="search">
      <ElForm ref="searchFormRef" inline :model="searchForm">
        <ElFormItem :label="$t('title')" prop="title">
          <ElInput v-model="searchForm.title" :placeholder="$t('placeholder_input') + $t('title')" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="load">
            <div class="i-ph:magnifying-glass"></div>{{ $t('search') }}
          </ElButton>
          <ElButton>
            <div class="i-ph:arrow-counter-clockwise"></div>{{ $t('reset') }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <ElRow :gutter="20" justify="space-between" class="mb-4">
        <ElCol :span="16" class="text-left">
          <ElButton type="danger">
            <div class="i-ph:trash"></div>{{ $t('clear') }}
          </ElButton>
          <ElButton type="success">
            <div class="i-ph:cloud-arrow-down"></div>{{ $t('export') }}
          </ElButton>
        </ElCol>

        <ElCol :span="8" class="text-right">
          <ElTooltip class="box-item" effect="dark" :content="$t('refresh')" placement="top">
            <ElButton type="primary" circle @click="load">
              <template #icon>
                <div class="i-ph:arrow-clockwise"></div>
              </template>
            </ElButton>
          </ElTooltip>

          <ElTooltip class="box-item" effect="dark" :content="$t('settings')" placement="top">
            <ElButton type="success" circle>
              <template #icon>
                <div class="i-ph:list-magnifying-glass"></div>
              </template>
            </ElButton>
          </ElTooltip>
        </ElCol>
      </ElRow>

      <ElTable :data="datas" lazy :load="load" row-key="id" stripe table-layout="auto">
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn type="index" :label="$t('no')" width="55" />
        <ElTableColumn prop="title" :label="$t('title')" />
        <ElTableColumn :show-overflow-tooltip="true" prop="content" :label="$t('content')" />
        <ElTableColumn :label="$t('actions')">
          <template #default="scope">
            <ElButton size="small" type="danger">
              <div class="i-ph:trash"></div>{{ $t('remove') }}
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination v-model:current-page="pagination.page" page-sizes v-model:page-size="pagination.size"
        :total="pagination.total" />
    </ElCard>
  </ElSpace>
</template>
