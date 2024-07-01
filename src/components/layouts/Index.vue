<script setup lang="ts">
import TopNav from 'components/layouts/TopNav.vue'
import Aside from 'components/layouts/Aside.vue'
import Footer from 'components/layouts/Footer.vue'
</script>

<template>
  <ElContainer class="h-screen">
    <ElHeader class="flex flex-nowrap bg-[var(--el-color-primary)] z-10">
      <TopNav />
    </ElHeader>
    <ElContainer>
      <ElAside width="200px">
        <Aside />
      </ElAside>
      <ElContainer class=" bg-[#F5F7FA] dark:bg-[#303133] h-[calc(100vh-50px)]">
        <ElMain>
          <RouterView v-slot="{ Component }">
            <Transition name="el-fade-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </ElMain>
        <ElFooter>
          <Footer />
        </ElFooter>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>
