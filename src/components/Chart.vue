<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, onActivated } from 'vue'
import { debounce } from 'lodash-es'
import echarts from 'boot/echarts'
import type { EChartsOption } from 'echarts'
import { useAppStore } from 'stores/app-store'
import { isString } from 'src/utils'


const appStore = useAppStore()

const props = withDefaults(defineProps<{
  options: EChartsOption
  width?: number | string
  height?: number | string
}>(), {
  width: '100%',
  height: '500px'
})

const theme = computed(() => appStore.isDark ? true : 'auto')

const options = computed(() => {
  return Object.assign({}, props.options, {
    darkMode: theme.value
  })
})

const elRef = ref<HTMLElement | null>(null)

let echartRef: Nullable<echarts.ECharts> = null

const contentEl = ref<Element>()

const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`
  const height = isString(props.height) ? props.height : `${props.height}px`

  return {
    width,
    height
  }
})

const initChart = () => {
  if (elRef.value && props.options) {
    echartRef = echarts.init(elRef.value as HTMLElement)
    echartRef?.setOption(options.value)
  }
}

watch(
  () => options.value,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options)
    }
  },
  {
    deep: true
  }
)

const resizeHandler = debounce(() => {
  if (echartRef) {
    echartRef.resize()
  }
}, 100)

const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}

// 使用一个同步的事件处理器
const handleContentResize = (e: TransitionEvent): void => {
  if (e.propertyName === 'width') {
    // 调用异步函数
    contentResizeHandler(e)
  }
}


onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 0)

  window.addEventListener('resize', resizeHandler)

  contentEl.value = document.getElementsByClassName(`el-layout-content`)[0]
  if (contentEl.value) {
    (contentEl.value as Element).addEventListener('transitionend', handleContentResize as EventListener)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  if (contentEl.value) {
    (contentEl.value as Element).removeEventListener('transitionend', handleContentResize as EventListener)
  }
})

onActivated(() => {
  if (echartRef) {
    echartRef.resize()
  }
})
</script>

<template>
  <div ref="elRef" :style="styles"></div>
</template>
