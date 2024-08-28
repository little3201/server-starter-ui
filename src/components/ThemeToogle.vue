<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from 'stores/app-store'

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
  <ElSwitch v-model="isDark" id="theme" name="theme" aria-label="theme"
    style="--el-switch-on-color: var(--el-border-color); --el-switch-off-color: var(--el-color-primary-light-3);"
    @change="themeChange">
    <template #active-action>
      <div class="i-material-symbols:dark-mode-outline-rounded ma-[3px]" />
    </template>
    <template #inactive-action>
      <div class="i-material-symbols:light-mode-outline-rounded ma-[3px]" />
    </template>
  </ElSwitch>
</template>