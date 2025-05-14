<script lang="ts" setup>
import { ref, onUnmounted, watchEffect } from 'vue'
import hljs from 'boot/hljs'
import type { HighlightResult } from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'

const props = defineProps<{
  content: string
}>()

const highlightResult = ref<HighlightResult | null>(null)

watchEffect(() => {
  highlightResult.value = hljs.highlightAuto(props.content || '')
})

onUnmounted(() => { highlightResult.value = null })
</script>

<template>
  <pre v-if="content" class="relative my-0">
    <code class="hljs" v-html="highlightResult?.value"></code>
    <small class="absolute top-0 right-0 pr-2 pt-2 text-white">
      {{ highlightResult?.language }}
    </small>
  </pre>
  <ElEmpty v-else description="No Data" />
</template>
