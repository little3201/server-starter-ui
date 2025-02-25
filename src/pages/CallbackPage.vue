<template>
  <ElContainer class="h-screen">
    <ElMain v-loading="loading"></ElMain>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { handleCallback } from 'src/api/authentication'


const { push } = useRouter()
const userStore = useUserStore()

const loading = ref(true)

onMounted(() => {
  handleCallback().then(res => {
    if (res) {
      userStore.$patch({
        accessToken: res.data.access_token
      })
      loading.value = false
      push('/')
    }
  })
})
</script>