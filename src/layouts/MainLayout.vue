<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import ThemeToogle from 'components/ThemeToogle.vue'
import LanguageSelector from 'components/LanguageSelector.vue'
import EssentialList from 'components/EssentialList.vue'
import { signOut } from 'src/api/authentication'


const { currentRoute } = useRouter()
const userStore = useUserStore()
</script>

<template>
  <ElContainer class="h-screen">
    <ElHeader class="flex flex-nowrap bg-[var(--el-color-primary)] z-10" height="50px">
      <div class="inline-flex flex-grow justify-between">
        <div class="inline-flex items-center">
          <ElImage src="/svgs/logo.svg" alt="avatar" class="w-8 h-8" />
          <span class="ml-3 text-20px font-bold text-white">Project Management</span>
        </div>

        <div class="inline-flex justify-end items-center space-x-4">
          <!-- language -->
          <LanguageSelector />
          <!-- theme -->
          <ThemeToogle />

          <ElDropdown trigger="click" class="cursor-pointer">
            <ElSpace>
              <ElAvatar alt="avatar" :size="28" :src="userStore.avatar" />
              <span class="text-white">{{ userStore.username }}</span>
            </ElSpace>
            <template #dropdown>
              <ElDropdownMenu>
                <RouterLink to="/profile" class="no-underline">
                  <ElDropdownItem>
                    <div class="i-material-symbols:manage-accounts-outline-rounded mr-2 " />{{ $t('profile') }}
                  </ElDropdownItem>
                </RouterLink>
                <ElDropdownItem divided @click="signOut">
                  <div class="i-material-symbols:logout-rounded mr-2 " />{{ $t('signout') }}
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
              <div class="i-material-symbols:home-outline-rounded mr-2" />{{ $t('home') }}
            </ElMenuItem>
            <template v-for="link in userStore.privileges" :key="link.id">
              <EssentialList v-if="link.children && link.children.length > 0" :essentialLink="link"
                :parent-path="`/${link.meta.path}`" />
              <ElMenuItem v-else :index="`/${link.meta.path}`">
                <div class="i-material-symbols:home-outline-rounded mr-2" />{{ $t(link.name) }}
              </ElMenuItem>
            </template>
          </ElMenu>
        </ElScrollbar>
      </ElAside>
      <ElContainer class="bg-[var(--el-bg-color-page)] h-[calc(100vh-50px)]">
        <ElMain>
          <RouterView />
        </ElMain>
        <ElFooter height="50px">
          <div class="text-sm text-center flex items-center justify-between">
            <span>Copyright &copy; {{ new Date().getFullYear() }} All Rights Reserved.</span>
            <ul class="flex flex-wrap items-center list-none">
              <li>
                <RouterLink to="/about"
                  class="no-underline hover:underline me-4 md:me-6 text-[var(--el-text-color-primary)]">About
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/privacy-policy"
                  class="no-underline hover:underline me-4 md:me-6 text-[var(--el-text-color-primary)]">Privacy
                  Policy</RouterLink>
              </li>
              <li>
                <RouterLink to="/license"
                  class="no-underline hover:underline me-4 md:me-6 text-[var(--el-text-color-primary)]">License
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/help" class="no-underline hover:underline me-4 text-[var(--el-text-color-primary)]">
                  Help
                </RouterLink>
              </li>
            </ul>
          </div>
        </ElFooter>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>
