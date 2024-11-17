<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeOptions } from 'src/i18n'
import { useLocaleStore } from 'stores/locale-store'

// 多语言相关

const { locale } = useI18n()
const localStore = useLocaleStore()

const currentLang = computed(() => localStore.lang)

const setHtmlPageLang = (locale: string = 'zh-CN') => {
  const htmlElement = document.querySelector('html')

  if (htmlElement) {
    htmlElement.setAttribute('lang', locale)
  }
}

const setLang = (lang: string) => {
  if (lang === currentLang.value) return
  locale.value = lang
  // 设置lang
  localStore.changeLang(lang)
  // 修改html中lang
  setHtmlPageLang(lang)
}
</script>

<template>
  <ElDropdown trigger="click" @command="setLang">
    <ElButton type="default" link>
      <div class="i-material-symbols:translate cursor-pointer w-6 h-6 text-white"></div>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in localeOptions" :key="item.value" :command="item.value">
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
