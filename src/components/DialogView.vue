<script setup lang="ts">
import { computed, useAttrs, ref, useSlots } from 'vue'
import type { Slot } from 'vue'
import { isNumber } from 'src/utils'
import { ElButton } from 'element-plus'

const slots: { [key: string]: Slot | undefined } = useSlots()

interface Props {
  [key: string]: string | number | boolean | undefined;
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  maxHeight?: string | number,
  showFullScreen?: boolean
  showClose?: boolean
}>(), {
  modelValue: false,
  showFullScreen: false,
  showClose: false
})

const getBindValue = computed(() => {
  const delArr: string[] = ['title', 'maxHeight']
  const attrs = useAttrs()
  const obj: Props = { ...attrs, ...props }
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
  const innerHeight = slots.footer ? 120 : 72
  return {
    height: fullScreen.value ? `${document.documentElement.offsetHeight - innerHeight}px` : dialogHeight.value
  }
})
</script>

<template>
  <ElDialog v-bind="getBindValue" :fullscreen="fullScreen" align-center destroy-on-close lock-scroll draggable
    append-to-body :close-on-click-modal="false" :show-close="showClose">
    <template #header>
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
      <ElButton v-if="showFullScreen" @click="toggleFull"
        :class="['absolute top-1.5 !border-none !border-0 !bg-transparent', showClose ? 'right-8 ' : 'right-1']">
        <div
          :class="[fullScreen ? 'icon-[material-symbols--fullscreen-exit-rounded]' : 'icon-[material-symbols--fullscreen-rounded]', 'el-dialog__close']">
        </div>
      </ElButton>
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>
