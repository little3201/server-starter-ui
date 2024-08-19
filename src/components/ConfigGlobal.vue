<script setup lang="ts">
import { computed } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import { useLocaleStore } from 'stores/locale-store'

// 多语言相关
const localStore = useLocaleStore()

const locale = computed(() => (localStore.lang === 'zh-CN' ? zhCn : localStore.lang === 'zh-TW' ? zhTw: en))
</script>

<template>
  <ElConfigProvider :locale="locale" :message="{ max: 1 }">
    <slot></slot>
  </ElConfigProvider>
</template>
