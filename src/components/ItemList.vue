<script setup lang="ts">
import type { PrivilegeTreeNode } from 'src/models'
import { pathResolve } from 'src/utils'

withDefaults(defineProps<{
  items: PrivilegeTreeNode[]
  parentPath?: string
}>(), {
  parentPath: ''
})

function isSubMenu(route: PrivilegeTreeNode) {
  if (route.children && route.children.length > 0) {
    let children = route.children
    for (const child of children) {
      if (child.hidden) {
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
  <template v-for="item in items" :key="item.name">
    <ElSubMenu v-if="item.children && isSubMenu(item)" :index="pathResolve(parentPath, item.path)">
      <template #title>
        <div :class="[item.icon, 'mr-2']" />
        {{ $t(item.name) }}
      </template>
      <ItemList :items="item.children" :parent-path="pathResolve(parentPath, item.path)" />
    </ElSubMenu>

    <ElMenuItem v-else-if="!item.hidden" :index="pathResolve(parentPath, item.path)">
      <div :class="[item.icon, 'mr-2 ']" />{{
        $t(item.name) }}
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
</style>