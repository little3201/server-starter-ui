<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(new Date())
</script>

<template>
  <ElCalendar v-model="value" />
</template>
