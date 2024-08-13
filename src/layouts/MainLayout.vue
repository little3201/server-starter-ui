<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '~/stores/app-store'
import { useUserStore } from '~/stores/user-store'

import ThemeToogle from 'components/ThemeToogle.vue'
import LanguageSelector from 'components/LanguageSelector.vue'
import ItemList from 'components/ItemList.vue'

const { currentRoute, replace } = useRouter()

const appStore = useAppStore()
const userStore = useUserStore()

const privileges = computed(() => userStore.privileges)

function signOut() {
  userStore.logout().then(() => replace('/login'))
}
</script>

<template>
  <ElContainer class="h-screen">
    <ElHeader class="flex flex-nowrap bg-[var(--el-color-primary)] z-10" height="50px">
      <div class="inline-flex flex-grow justify-between">
        <div class="inline-flex items-center">
          <img src="/vite.svg" alt="" class="w-8 h-8 mr-3" />
          <span class="text-20px font-bold text-white">{{ appStore.getTitle }}</span>
        </div>

        <div class="inline-flex justify-end items-center space-x-4">
          <ThemeToogle />
          <LanguageSelector />
          <ElDropdown trigger="click">
            <ElSpace>
              <ElAvatar :size="28" src="#" />
              <span class="text-white">{{ userStore.user?.username }}</span>
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
    </ElHeader>
    <ElContainer>
      <ElAside width="200px">
        <ElScrollbar>
          <ElMenu router unique-opened :default-active="currentRoute.fullPath">
            <ElMenuItem :index="'/'">
              <div class="i-ph:house mr-2" />{{ $t('home') }}
            </ElMenuItem>
            <ItemList :items="privileges" />
          </ElMenu>
        </ElScrollbar>
      </ElAside>
      <ElContainer class=" bg-[#F5F7FA] dark:bg-[#303133] h-[calc(100vh-50px)]">
        <ElMain>
          <RouterView />
        </ElMain>
        <ElFooter height="50px">
          <p class="text-sm text-center">&copy; {{ new Date().getFullYear() }}
            All Rights Reserved.</p>
        </ElFooter>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>
