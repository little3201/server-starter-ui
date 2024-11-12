<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import hljs from 'boot/hljs'
import { useAppStore } from 'stores/app-store'

const appStore = useAppStore()

// 初始化获取是否是暗黑主题
const isDark = ref(appStore.isDark)

const props = withDefaults(defineProps<{
  content: string
}>(), {
  content: ''
})

const rendered = ref(hljs.highlightAuto(props.content).value)

watchEffect(() => {
  if (isDark.value) {
    import('highlight.js/styles/base16/summerfruit-dark.min.css')
  } else {
    import('highlight.js/styles//base16/summerfruit-light.min.css')
  }

  rendered.value = hljs.highlightAuto(props.content).value
})
</script>

<template>
  <article>
    <pre><code class="hljs lang-ts" v-html="rendered"></code></pre>
  </article>
</template>
