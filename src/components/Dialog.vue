<script setup lang="ts">
import { computed, useAttrs, ref, useSlots } from 'vue'
import { isNumber } from 'src/utils'

const slots = useSlots()

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  maxHeight?: string | number,
  showFullScreen?: boolean
}>(), {
  modelValue: false,
  title: 'Dialog',
  maxHeight: undefined,
  showFullScreen: false
})

const getBindValue = computed(() => {
  const delArr: string[] = ['title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props } as { [key: string]: any }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const fullScreen = ref(false)

const toggleFull = () => {
  fullScreen.value = !fullScreen.value
}

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

const dialogStyle = computed(() => {
  let innerHeight = slots.footer ? 120 : 72
  return {
    height: fullScreen.value ? `${document.body.clientHeight - innerHeight}px` : dialogHeight.value
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
          <div v-if="showFullScreen"
            :class="[fullScreen ? 'i-material-symbols:fullscreen-exit-rounded' : 'i-material-symbols:fullscreen-rounded', 'cursor-pointer hover:text-[var(--el-color-primary)]']"
            @click="toggleFull" />
          <div class="i-material-symbols:close-rounded cursor-pointer w-6 h-6 hover:text-[var(--el-color-primary)]"
            @click="close" />
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
