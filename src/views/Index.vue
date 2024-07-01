<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(new Date())
</script>

<template>
  <ElCard shadow="never">
    <ElCalendar v-model="value" />
  </ElCard>
</template>
