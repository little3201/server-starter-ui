<script setup lang="ts">
import { computed, useAttrs, ref, unref, useSlots } from 'vue'
import { propTypes } from '~/utils/propTypes'
import { isNumber } from '~/utils'

const slots = useSlots()

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  maxHeight: propTypes.oneOfType([String, Number])
})

const getBindValue = computed(() => {
  const delArr: string[] = [ 'title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props } as { [key: string]: any }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const isFullscreen = ref(false)

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen)
}

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight)
  }
})
</script>

<template>
  <ElDialog v-bind="getBindValue" :fullscreen="isFullscreen" align-center destroy-on-close lock-scroll draggable
    append-to-body :close-on-click-modal="false" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="flex justify-between items-center">
        <slot name="title">
          <span :id="titleId" :class="titleClass">{{ title }}</span>
        </slot>
        <div class="inline-flex justify-between items-center space-x-4">
          <div
            :class="[isFullscreen ? 'i-ph:corners-in' : 'i-ph:corners-out', 'cursor-pointer hover:text-[var(--el-color-primary)]']"
            @click="toggleFull" />
          <div class="i-ph:x cursor-pointer hover:text-[var(--el-color-primary)]" @click="close" />
        </div>
      </div>
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>
