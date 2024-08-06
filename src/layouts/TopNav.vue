<script lang="ts" setup>
import { useAppStore } from 'stores/modules/app'
import { useUserStore } from 'stores/modules/user'
import { usePermissionStore } from 'stores/modules/permission'
import ThemeSwitch from 'components/ThemeSwitch.vue'
import LocaleDropdown from 'components/LocaleDropdown.vue'
import SizeDropdown from 'components/SizeDropdown.vue'
import { api } from '~/composables/axios'

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

function signOut() {
  api.post("/logout").then(() => {
    userStore.clear()
    permissionStore.clear()
  });
}
</script>

<template>
  <div class="inline-flex flex-grow justify-between">
    <div class="inline-flex items-center">
      <img src="/vite.svg" alt="" class="w-8 h-8 mr-3" />
      <span class="text-20px font-bold text-white">{{ appStore.getTitle }}</span>
    </div>

    <div class="inline-flex justify-end items-center space-x-4">
      <ThemeSwitch />
      <LocaleDropdown />
      <SizeDropdown />
      <ElDropdown trigger="click">
        <ElSpace>
          <ElAvatar :size="28" src="#" />
          <span class="text-white">{{ userStore.getUser?.username }}</span>
        </ElSpace>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem>
              {{ $t('profile') }}
            </ElDropdownItem>
            <ElDropdownItem divided @click="signOut">
              {{ $t('signout') }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>
