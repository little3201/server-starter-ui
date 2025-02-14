<script setup lang="ts">
import type { PrivilegeTreeNode } from 'src/types'
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
    <template v-for="link in essentialLink.children" :key="link.id">
      <EssentialList v-if="link.children && link.children.length > 0" :essentialLink="link"
        :parent-path="pathResolve(parentPath, link.meta.path)" />
      <ElMenuItem v-else :index="pathResolve(parentPath, link.meta.path)">
        <div :class="[`i-material-symbols:${link.meta.icon}`, 'mr-2 ']" />
        {{ $t(link.name) }}
      </ElMenuItem>
    </template>
  </ElSubMenu>
</template>
