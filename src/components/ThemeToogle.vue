<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue'


const isDark = useDark()
</script>

<template>
  <ElSwitch v-model="isDark" id="theme" name="theme"
    style="--el-switch-on-color: var(--el-border-color); --el-switch-off-color: var(--el-color-primary-light-3);"
    @change="useToggle">
    <template #active-action>
      <Icon icon="material-symbols:dark-mode-outline-rounded" width="18" height="18" />
    </template>
    <template #inactive-action>
      <Icon icon="material-symbols:light-mode-outline-rounded" width="18" height="18" />
    </template>
  </ElSwitch>
</template>
