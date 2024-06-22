<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import lottie from 'lottie-web'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElFormItem, type FormInstance, type FormRules } from 'element-plus'
import ThemeSwitch from 'components/ThemeSwitch.vue'
import LocaleDropdown from 'components/LocaleDropdown.vue'
import Footer from 'components/layouts/Footer.vue'
import { useAppStore } from 'stores/modules/app'
import { useUserStore } from 'stores/modules/user'
import { usePermissionStore } from 'stores/modules/permission'
import { api } from '~/composables/axios'
import { retrievePrivilegeTree } from '~/api/privileges'


const { t } = useI18n()
const { currentRoute, replace } = useRouter()

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const lottieRef = ref<HTMLDivElement>()

const loading = ref<boolean>(false)

const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  password: '',
  rememberMe: true
})

const rules = reactive<FormRules<typeof form>>({
  username: [
    { required: true, message: t('inputText') + t('username'), trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('inputText') + t('password'), trigger: 'blur' },
    { min: 8, max: 16, message: 'Length should be 8 to 16', trigger: 'blur' },
  ]
})

onMounted(() => {
  show()
})

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return

  formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      signIn(form)
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 登录
function signIn(formData: { username: string, password: string }) {
  loading.value = true

  api.post('/login', new URLSearchParams(formData)).then(res => {
    userStore.setUser(res.data.user)
    userStore.setRole(res.data.user.role)
    userStore.setRememberMe(form.rememberMe)

    // set token
    userStore.setAccessToken(res.data.access_token)
    api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;

    // privileges
    fetchPrivileges(formData.username)
  }).finally(() => loading.value = false)
}

// 获取权限
async function fetchPrivileges(username: string) {
  const res = await retrievePrivilegeTree(username)
  if (res.data) {
    const routers: AppCustomRouteRecordRaw[] = res.data || []

    permissionStore.setAddRouters(routers)

    const redirect = currentRoute.value.query.redirect as string
    replace(redirect || '/')
  }
}

function show() {
  if (lottieRef.value) {
    lottie.loadAnimation({
      container: lottieRef.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/bg.json'
    })
  }
}
</script>

<template>
  <ElContainer class="h-screen relative overflow-hidden bg-[#e3f4fa] dark:bg-black">
    <figure class="absolute bg-primary-gradient rounded-full"
      style="height: 500px; width: 500px;  top: -270px; right: -200px; background-color: var(--ep-color-primary);" />
    <figure class="absolute bg-positive-gradient rounded-full"
      style="height: 300px; width: 300px; bottom: 50px; right: -100px; background-color: var(--ep-color-success);" />
    <figure class="absolute bg-warning-gradient rounded-full"
      style="height: 600px; width: 600px; bottom: -270px; left: -200px; background-color: var(--ep-color-warning);" />
    <figure class="absolute bg-negative-gradient rounded-full"
      style="height: 300px;  width: 300px; bottom: -230px; left: 200px; background-color: var(--ep-color-danger);" />

    <ElHeader class="flex flex-nowrap items-center z-10">
      <div class="inline-flex flex-grow justify-between">
        <div class="inline-flex items-center">
          <img src="/vite.svg" alt="" class="w-12 h-12 mr-3" />
          <span class="text-20px font-bold">{{ appStore.getTitle }}</span>
        </div>

        <div class="inline-flex justify-end items-center space-x-4">
          <ThemeSwitch />
          <LocaleDropdown class=" dark:text-white" />
        </div>
      </div>
    </ElHeader>
    <ElMain class="items-center justify-center z-10 ">
      <section
        class="inline-flex justify-center items-center shadow-2xl dark:shadow-[#ffffff38] overflow-hidden rounded-3xl w-2/3 border-solid border-1 border-[#ffffff38]"
        style="height: 70vh;">
        <section class="h-full w-1/2 bg-white dark:bg-black flex-col items-center">
          <section class="inline-flex flex-grow items-center justify-center h-full">
            <Transition appear enter-active-class="animate__animated animate__slideInLeft"
              leave-active-class="animate__animated animate__slideOutLeft">
              <div class="inline-flex flex-col justify-center items-center" style="margin-top: -40px">
                <div ref="lottieRef" style="height: 450px; width: 450px" />
                <div class="-mt-8">
                  <p class="font-bold text-xl text-left">
                    {{ $t('welcome') }}
                  </p>
                  <p class="text-subtitle1">
                    {{ $t('subtitle') }}
                  </p>
                </div>
              </div>
            </Transition>
          </section>
        </section>
        <section class="w-1/2 h-full flex-row items-center bg-[#e3f4fa] dark:bg-black">
          <Transition appear enter-active-class="animate__animated animate__slideInRight"
            leave-active-class="animate__animated animate__slideOutRight">
            <div class="inline-flex flex-col h-full space-y-2xl justify-center items-center">
              <div class="text-center">
                <ElImage alt="logo" src="/vite.svg" style="height: 120px; max-width: 120px" />
              </div>
              <div class="text-2xl text-center mb-xs">
                {{ $t('signinTo') }}
              </div>
              <ElForm ref="formRef" :model="form" :rules="rules" class="bg-transparent space-y-3xl px-12">
                <ElFormItem prop="username">
                  <ElInput size="large" :disable="loading" v-model="form.username" :placeholder="$t('username')">
                    <template #prefix>
                      <div class="i-ph:user" />
                    </template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem prop="password">
                  <ElInput size="large" :disable="loading" type="password" v-model="form.password"
                    :placeholder="$t('password')" show-password style="width: 23rem">
                    <template #prefix>
                      <div class="i-ph:key" />
                    </template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem prop="rememberMe">
                  <ElCheckbox :disable="loading" v-model="form.rememberMe" :label="$t('rememberMe')" dense
                    v:model-value="changeRememberMe" />
                </ElFormItem>
                <ElFormItem>
                  <ElButton size="large" type="primary" :loading="loading" @click="onSubmit(formRef)" class="w-full"
                    title="signin_submit">
                    {{ $t('signin') }}
                  </ElButton>
                </ElFormItem>
              </ElForm>
            </div>
          </Transition>
        </section>
      </section>
    </ElMain>
    <ElFooter class="z-10">
      <Footer />
    </ElFooter>
  </ElContainer>
</template>

<style lang="scss" scoped>
.el-main {
  display: flex;
}
</style>