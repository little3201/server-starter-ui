<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from 'stores/app-store'
import { Sunny, Moon } from '@element-plus/icons-vue'

const appStore = useAppStore()

// 初始化获取是否是暗黑主题
const isDark = ref(appStore.isDark)

const themeChange = (val: string | number | boolean) => {
  if (typeof val == 'boolean') {
    appStore.setDark(val)
  }
}
</script>

<template>
  <ElSwitch v-model="isDark" inline-prompt
    style="--el-switch-on-color: var(--el-color-info-light-3); --el-switch-off-color: var(--el-color-primary-light-3)"
    :active-icon="Moon" :inactive-icon="Sunny" @change="themeChange" />
</template>
