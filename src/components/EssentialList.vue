<script setup lang="ts">
import type { PrivilegeTreeNode } from 'src/models'
import { pathResolve } from 'src/utils'

withDefaults(defineProps<{
  essentialLinks: PrivilegeTreeNode[]
  parentPath?: string
}>(), {
  parentPath: ''
})

function isSubMenu(children: PrivilegeTreeNode[]) {
  for (const child of children) {
    if (child.hidden) {
      return false
    }
  }
  return true
}
</script>

<template>
  <template v-for="link in essentialLinks" :key="link.name">
    <ElSubMenu v-if="link.children && isSubMenu(link.children)" :index="pathResolve(parentPath, link.path)">
      <template #title>
        <div :class="[link.icon, 'mr-2']" />
        {{ $t(link.name) }}
      </template>
      <EssentialList :essentialLinks="link.children" :parent-path="pathResolve(parentPath, link.path)" />
    </ElSubMenu>

    <ElMenuItem v-else-if="!link.hidden" :index="pathResolve(parentPath, link.path)">
      <div :class="[link.icon, 'mr-2 ']" />{{
        $t(link.name) }}
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

.el-menu-link.is-active {
  background-color: var(--el-menu-hover-bg-color) !important;
}
</style>