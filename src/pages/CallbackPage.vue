<template>
  <ElContainer class="h-screen">
    <ElMain v-loading="loading"></ElMain>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { signIn, handleCallback } from 'src/api/authentication'


const { push } = useRouter()
const userStore = useUserStore()

const loading = ref(true)

onMounted(() => {
  handleCallback().then(res => {
    if (res) {
      // 回调成功，删除code_verifier
      localStorage.removeItem('code_verifier')
      localStorage.setItem('id_token_hint', res.data.id_token)
      userStore.$patch({
        accessToken: res.data.access_token
      })
      loading.value = false
      push('/')
    }
  }).catch(() => {
    // 回调失败，登录
    signIn()
  })
})
</script>