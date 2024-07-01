<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `app-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ConfigGlobal from 'components/ConfigGlobal.vue'
import { useAppStore } from 'stores/modules/app'

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

appStore.initTheme()
</script>
