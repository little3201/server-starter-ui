<template>
  <div v-loading="loading"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { handleCallback } from 'boot/auth-service'
import type { User } from 'oidc-client-ts'


const { push } = useRouter()
const userStore = useUserStore()

const loading = ref(true)

onMounted(() => {
  if (window.location.search.includes('code=')) {
    handleCallback().then((res: User) => {
      if (res) {
        userStore.$patch({
          username: res.profile.sub,
          accessToken: res.access_token
        })
        loading.value = false
        push('/')
      }
    })
  }

})
</script>