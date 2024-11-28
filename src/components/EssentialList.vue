<script setup lang="ts">
import type { PrivilegeTreeNode } from 'src/models'
import { pathResolve } from 'src/utils'

withDefaults(defineProps<{
  essentialLink: PrivilegeTreeNode
  parentPath?: string
}>(), {
  parentPath: ''
})

</script>

<template>
  <ElSubMenu :index="essentialLink.meta.path">
    <template #title>
      <div :class="[`i-material-symbols:${essentialLink.meta.icon}`, 'mr-2']" />
      {{ $t(essentialLink.name) }}
    </template>
    <template v-for="item in essentialLink.children" :key="item.id">
      <EssentialList v-if="item.children && item.children.length > 0" :essentialLink="item"
        :parent-path="pathResolve(parentPath, item.meta.path)" />
      <ElMenuItem v-else :index="`/${pathResolve(parentPath, item.meta.path)}`">
        <div :class="[`i-material-symbols:${item.meta.icon}`, 'mr-2 ']" />
        {{ $t(item.name) }}
      </ElMenuItem>
    </template>
  </ElSubMenu>
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
