<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, onActivated } from 'vue'
import { useDark, useEventListener } from '@vueuse/core'
import { debounce } from 'lodash-es'
import ApexCharts from 'apexcharts'
import { isString } from 'src/utils'

const props = withDefaults(defineProps<{
  options: ApexCharts.ApexOptions // 使用 ApexCharts 的配置类型
  width?: number | string
  height?: number | string
}>(), {
  width: '100%',
  height: '400px'
})

const isDark = useDark()

const options = computed(() => {
  return Object.assign({}, props.options, {
    theme: {
      mode: isDark.value ? 'dark' : 'light'
    }
  })
})

const elRef = ref<HTMLElement | null>(null)

let chartRef: ApexCharts | null = null

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
    // 销毁旧图表，防止重复渲染
    if (chartRef) {
      chartRef.destroy()
    }
    chartRef = new ApexCharts(elRef.value, options.value)
    chartRef?.render()
  }
}

watch(
  () => options.value,
  (options) => {
    if (chartRef) {
      // 第二个参数 true 表示对图表强制更新
      chartRef?.updateOptions(options, true, false)
    }
  },
  {
    deep: true
  }
)

const resizeHandler = debounce(() => {
  if (chartRef) {
    chartRef?.destroy()
    initChart()
  }
}, 100)

const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}

const handleContentResize = (e: TransitionEvent): void => {
  if (e.propertyName === 'width') {
    contentResizeHandler(e)
  }
}

useEventListener(document, 'transitionend', (evt) => {
  contentEl.value = document.getElementsByClassName('el-layout-content')[0]
  if (contentEl.value) {
    handleContentResize(evt)
  }
})

onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 0)

})

onBeforeUnmount(() => {
  if (chartRef) {
    chartRef.destroy()
  }
})

onActivated(() => {
  if (chartRef) {
    resizeHandler()
  }
})
</script>

<template>
  <div ref="elRef" :style="styles"></div>
</template>
