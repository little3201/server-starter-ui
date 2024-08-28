<script setup lang="ts">
import { ref } from 'vue'
import type { ElDropdown } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const emit = defineEmits(['visibleChange'])

const props = withDefaults(defineProps<{
  schema: ContextMenuSchema[]
  trigger: 'hover' | 'click' | 'contextmenu'
  tagItem?: RouteLocationNormalizedLoaded
}>(), {
  trigger: 'contextmenu'
})

const command = (item: ContextMenuSchema) => {
  item.command && item.command(item)
}

const visibleChange = (visible: boolean) => {
  emit('visibleChange', visible, props.tagItem)
}

const elDropdownMenuRef = ref<ComponentRef<typeof ElDropdown>>()

defineExpose({
  elDropdownMenuRef,
  tagItem: props.tagItem
})
</script>

<template>
  <ElDropdown ref="elDropdownMenuRef" :trigger="trigger" placement="bottom-start" @command="command"
    @visible-change="visibleChange">
    <slot></slot>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="(item, index) in schema" :key="index" :divided="item.divided" :disabled="item.disabled"
          :command="item">
          <div :class="[item.icon, 'mr-1']" /> {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
