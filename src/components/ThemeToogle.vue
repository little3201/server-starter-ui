<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'


const isDark = useDark()
</script>

<template>
  <ElSwitch v-model="isDark" id="theme" name="theme"
    style="--el-switch-on-color: var(--el-border-color); --el-switch-off-color: var(--el-color-primary-light-3);"
    @change="useToggle">
    <template #active-action>
      <div class="i-material-symbols:dark-mode-outline-rounded ma-[3px]" />
    </template>
    <template #inactive-action>
      <div class="i-material-symbols:light-mode-outline-rounded ma-[3px]" />
    </template>
  </ElSwitch>
</template>
