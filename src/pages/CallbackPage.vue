<template>
  <ElContainer class="h-screen">
    <ElMain v-loading="loading"></ElMain>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import Cookies from 'universal-cookie'
import { signIn, handleCallback } from 'src/api/authentication'


const { replace } = useRouter()
const userStore = useUserStore()
const cookies = new Cookies(null, { path: '/' })

const loading = ref(true)

onMounted(() => {
  handleCallback().then(res => {
    if (res) {
      // 回调成功，删除code_verifier
      localStorage.removeItem('code_verifier')
      // 存储id_token
      localStorage.setItem('id_token_hint', res.data.id_token)
      userStore.$patch({
        accessToken: res.data.access_token
      })
      loading.value = false
      // 路由跳转
      replace(cookies.get('redirect') || '/')
    }
  }).catch(() => {
    // 回调失败，登录
    signIn()
  })
})
</script>