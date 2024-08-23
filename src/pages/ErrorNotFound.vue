<script setup lang="ts">
import { useRouter } from 'vue-router'
import pageError from 'assets/svgs/404.svg'
import networkError from 'assets/svgs/500.svg'
import noPermission from 'assets/svgs/403.svg'

interface ErrorMap {
  url: string
  message: string
}

const errorMap: {
  [key: string]: ErrorMap
} = {
  '404': {
    url: pageError,
    message: 'pageError'
  },
  '500': {
    url: networkError,
    message: 'networkError'
  },
  '403': {
    url: noPermission,
    message: 'noPermission'
  }
}

const { push } = useRouter()

withDefaults(defineProps<{
  type?: '404' | '500' | '403'
}>(), {
  type: '404'
})
</script>

<template>
  <ElContainer class="h-screen">
    <ElMain class="flex-col tems-center justify-center">
      <ElImage :alt="type" :src="errorMap[type].url" class="w-1/3 mx-auto" />
      <div class="text-center">
        <div class="text-2xl text-[var(--el-color-info)]">{{ $t(errorMap[type].message) }}</div>
        <div class="mt-5">
          <ElButton size="large" type="primary" @click="push('/')">{{ $t('goHome') }}</ElButton>
        </div>
      </div>
    </ElMain>
  </ElContainer>
</template>

<style lang="scss" scoped>
.el-main {
  display: flex;
}
</style>