<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'

import AsideItem from './AsideItem.vue'
import { usePermissionStore } from 'stores/modules/permission'

const { currentRoute } = useRouter()
const permissionStore = usePermissionStore()

const routes = computed(() => permissionStore.getRouters)
</script>

<template>
  <ElScrollbar>
    <ElMenu router unique-opened :default-active="currentRoute.fullPath">
        <AsideItem :routes="routes" />
    </ElMenu>
  </ElScrollbar>
</template>
