<script setup lang="ts">
import type { PropType } from 'vue'
import { pathResolve } from '~/utils/routerHelper'

defineProps({
  routes: {
    type: Array as PropType<AppRouteRecordRaw[]>,
    required: true
  },
  parentPath: {
    type: String,
    default: ''
  }
})

function isSubMenu(route: AppRouteRecordRaw) {
  if (route.children) {
    let children = route.children
    for (const child of children) {
      if (child.meta.hidden) {
        return false
      }
    }
    return true
  } else {
    return false
  }
}
</script>

<template>
  <template v-for="route in routes">
    <ElSubMenu v-if="route.children && isSubMenu(route)" :index="pathResolve(parentPath, route.path)">
      <template #title>
        <div :class="[route.meta.icon, 'mr-2']" />{{ $t(route.name.replace(route.name[0],
          route.name[0].toLowerCase()))
        }}
      </template>
      <AsideItem :routes="route.children" :parent-path="pathResolve(parentPath, route.path)" />
    </ElSubMenu>

    <ElMenuItem v-else-if="!route.meta.hidden" :index="pathResolve(parentPath, route.path)">
      <div :class="[route.meta.icon, 'mr-2 ']" />{{
        $t(route.name.replace(route.name[0], route.name[0].toLowerCase())) }}
    </ElMenuItem>
  </template>
</template>

<style lang="scss" scope>
.el-menu--inline {
  li {
    margin: 6px;
    border-radius: var(--el-border-radius-base);
  }
}

.el-menu-item.is-active {
  background-color: var(--el-menu-hover-bg-color) !important;
}

.el-sub-menu.is-active .el-sub-menu__title {
  color: var(--el-menu-active-color) !important;
}
</style>