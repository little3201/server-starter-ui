<script setup lang="ts">
import { computed } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useLocaleStore } from 'stores/modules/locale'

// 多语言相关
const localStore = useLocaleStore()

const locale = computed(() => (localStore.getLang === 'zh-CN' ? zhCn : en))
</script>

<template>
  <ElConfigProvider :locale="locale" :message="{ max: 1 }">
    <slot></slot>
  </ElConfigProvider>
</template>
