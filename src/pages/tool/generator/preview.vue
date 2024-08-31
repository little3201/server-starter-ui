<template>
  <ElTabs stretch>
    <ElTabPane v-for="code in codes" :key="code.name" :label="code.name" class="w-full">
      <div id="preview">
        <pre><code class="hljs" v-html="hljs.highlightAuto(code.content).value"></code></pre>
      </div>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import type { Code } from 'src/models'
import hljs from 'boot/hljs'

defineProps<{
  codes: Code[]
}>()

</script>