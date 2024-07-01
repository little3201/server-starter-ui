<script setup lang="ts">
import pageError from '~/assets/svgs/404.svg'
import networkError from '~/assets/svgs/500.svg'
import noPermission from '~/assets/svgs/403.svg'
import { propTypes } from '~/utils/propTypes'

interface ErrorMap {
  url: string
  message: string
  buttonText: string
}

const errorMap: {
  [key: string]: ErrorMap
} = {
  '404': {
    url: pageError,
    message: 'pageError',
    buttonText: 'returnToHome'
  },
  '500': {
    url: networkError,
    message: 'networkError',
    buttonText: 'returnToHome'
  },
  '403': {
    url: noPermission,
    message: 'noPermission',
    buttonText: 'returnToHome'
  }
}

const props = defineProps({
  type: propTypes.string.validate((v: string) => ['404', '500', '403'].includes(v)).def('404')
})

const emit = defineEmits(['errorClick'])

const btnClick = () => {
  emit('errorClick', props.type)
}
</script>

<template>
  <ElContainer class="h-screen">
    <ElMain class="items-center justify-center">
      <div class="inline-flex items-center justify-center">
        <div class="text-center">
          <img width="350" :src="errorMap[type].url" alt="" />
          <div class="text-base text-[var(--el-color-info)]">{{ $t(errorMap[type].message) }}</div>
          <div class="mt-5">
            <ElButton size="large" type="primary" @click="btnClick">{{ $t(errorMap[type].buttonText) }}</ElButton>
          </div>
        </div>
      </div>
    </ElMain>
  </ElContainer>
</template>

<style lang="scss" scoped>
.el-main {
  display: flex;
}
</style>