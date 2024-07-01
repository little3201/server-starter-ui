<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentSize } from 'element-plus'
import { useAppStore } from 'stores/modules/app'

const appStore = useAppStore()

const sizeMap = computed(() => appStore.sizeMap)

const setCurrentSize = (size: ComponentSize) => {
  appStore.setCurrentSize(size)
}
</script>

<template>
  <ElDropdown trigger="click" @command="setCurrentSize">
    <div class="i-ph:text-aa cursor-pointer w-6 h-6 text-white" />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in sizeMap" :key="item" :command="item">
          {{ $t(item) }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
