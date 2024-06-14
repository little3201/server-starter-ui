<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from 'stores/modules/app'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

// 多语言相关
const appStore = useAppStore()

const locale = computed(() => (appStore.getLocale === 'zh-CN' ? zhCn : en))
</script>

<template>
  <ElConfigProvider :locale="locale" :message="{ max: 1 }">
    <slot></slot>
  </ElConfigProvider>
</template>
