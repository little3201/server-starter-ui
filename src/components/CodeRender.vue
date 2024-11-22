<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
import hljs from 'boot/hljs'
import type { HighlightResult } from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'

const props = defineProps<{
  content: string
}>()

const highlightResult = ref<HighlightResult | null>(null)

watch(() => props.content, (newVal) => {
  if (newVal) {
    highlightResult.value = hljs.highlightAuto(newVal)
  }
})

onUnmounted(() => { highlightResult.value = null })
</script>

<template>
  <article>
    <pre class="relative m-0">
      <code class="hljs" v-html="highlightResult?.value"></code>
      <small class="absolute top-2 right-0 px-2 text-white">
        {{ highlightResult?.language }}
      </small>
    </pre>
  </article>
</template>
