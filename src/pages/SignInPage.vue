<!-- not used -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { DotLottie } from '@lottiefiles/dotlottie-web'
import { useI18n } from 'vue-i18n'
import { ElFormItem, type FormInstance, type FormRules } from 'element-plus'
import ThemeToogle from 'components/ThemeToogle.vue'
import LanguageSelector from 'components/LanguageSelector.vue'
const { t } = useI18n()

const lottieRef = ref<HTMLCanvasElement | null>(null)

const loading = ref<boolean>(false)

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const rules = reactive<FormRules<typeof form>>({
  username: [
    { required: true, message: t('inputText', { field: t('username') }), trigger: 'blur' },
    { min: 5, max: 12, message: t('lengthRange', { min: 5, max: 12 }), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('inputText', { field: t('password') }), trigger: 'blur' },
    { min: 8, max: 32, message: t('lengthRange', { min: 8, max: 32 }), trigger: 'blur' }
  ]
})

onMounted(() => {
  load()
})

async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      loading.value = true
    }
  })
}

function load() {
  if (lottieRef.value) {
    new DotLottie({
      canvas: lottieRef.value,
      loop: true,
      autoplay: true,
      src: '/1707289607880.lottie',
      renderConfig: {
        autoResize: true
      }
    })
  }
}
</script>

<template>
  <ElContainer
    class="h-screen relative overflow-hidden bg-[var(--el-color-primary-light-9)] dark:bg-[var(--el-bg-color-page)]">
    <figure class="absolute bg-primary-gradient rounded-full"
      style="height: 31em; width: 31em;  top: -14em; right: -12em; ">
    </figure>
    <figure class="absolute bg-success-gradient rounded-full"
      style="height: 19em; width: 19em; bottom: 6em; right: -7em; ">
    </figure>
    <figure class="absolute bg-warning-gradient rounded-full"
      style="height: 40em; width: 40em; bottom: -17em; left: -15em;">
    </figure>
    <figure class="absolute bg-error-gradient rounded-full"
      style="height: 19em;  width: 19em; bottom: -12em; left: 12em; ">
    </figure>

    <ElHeader class="flex flex-nowrap items-center z-10" height="50px">
      <div class="inline-flex flex-grow justify-between">
        <div class="inline-flex items-center">
          <ElImage src="/svgs/logo.svg" alt="logo" class="w-12 h-12" />
          <span class="ml-3 text-20px font-bold">Project Management</span>
        </div>

        <div class="inline-flex justify-end items-center space-x-4">
          <!-- language -->
          <LanguageSelector />
          <!-- theme -->
          <ThemeToogle />
        </div>
      </div>
    </ElHeader>
    <ElMain class="items-center justify-center z-10">
      <ElCard class="w-full lg:w-1/2 xl:w-2/3" style="height: 70vh;border-radius: 1.5rem;"
        body-class="flex items-center !p-0 h-full">
        <div class="hidden-lg-and-down flex flex-col items-center h-full w-1/2  ">
          <div class="inline-flex flex-grow items-center justify-center h-full">
            <Transition appear enter-active-class="animate__animated animate__slideInLeft"
              leave-active-class="animate__animated animate__slideOutLeft">
              <div class="inline-flex flex-col justify-center items-center" style="margin-top: -40px">
                <canvas ref="lottieRef" style="height: 450px; width: 450px" />
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
          </div>
        </div>
        <div
          class="flex flex-row items-center w-full xl:w-1/2 h-full  bg-[var(--el-color-primary-light-9)] dark:bg-transparent">
          <Transition appear enter-active-class="animate__animated animate__slideInRight"
            leave-active-class="animate__animated animate__slideOutRight">
            <div class="flex flex-col w-full h-full space-y-2xl justify-center items-center">
              <div class="text-center">
                <ElImage src="/svgs/logo.svg" alt="logo" class="w-24 h-24" />
              </div>
              <div class="text-lg font-bold text-center mb-xs">
                {{ $t('signinTo') }}
              </div>
              <ElForm ref="formRef" :model="form" :rules="rules" @submit.prevent="onSubmit(formRef)"
                class="bg-transparent w-full">
                <ElRow class="px-12 my-3">
                  <ElCol>
                    <ElFormItem prop="username">
                      <ElInput size="large" :disable="loading" v-model="form.username" :placeholder="$t('username')">
                        <template #prefix>
                          <Icon icon="material-symbols:person-outline-rounded" width="18" height="18" />
                        </template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                </ElRow>
                <ElRow class="px-12">
                  <ElCol>
                    <ElFormItem prop="password">
                      <ElInput size="large" :disable="loading" type="password" v-model="form.password"
                        :placeholder="$t('password')" show-password>
                        <template #prefix>
                          <Icon icon="material-symbols:key-vertical-outline-rounded" width="18" height="18" />
                        </template>
                      </ElInput>
                    </ElFormItem>
                  </ElCol>
                </ElRow>
                <ElRow class="px-12">
                  <ElCol>
                    <ElFormItem prop="rememberMe">
                      <ElCheckbox :disable="loading" v-model="form.rememberMe" :label="$t('rememberMe')" dense
                        v:model-value="changeRememberMe" />
                    </ElFormItem>
                    <ElFormItem>
                      <ElButton title="signin" size="large" type="primary" :loading="loading" class="w-full"
                        native-type="submit">
                        {{ $t('signin') }}
                      </ElButton>
                    </ElFormItem>
                  </ElCol>
                </ElRow>
              </ElForm>
            </div>
          </Transition>
        </div>
      </ElCard>
    </ElMain>
    <ElFooter class="z-10" height="50px">
      <p class="text-sm text-center">&copy; {{ new Date().getFullYear() }}
        All Rights Reserved.</p>
    </ElFooter>
  </ElContainer>
</template>

<style lang="scss" scoped>
.el-main {
  display: flex;
}

.el-form-item {
  margin-bottom: 18px;
}
</style>
