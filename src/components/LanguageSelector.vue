<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeMap } from '~/boot/i18n'
import { useLocaleStore } from 'stores/modules/locale'

// 多语言相关

const { locale } = useI18n()
const localStore = useLocaleStore()

const currentLang = computed(() => localStore.getLang)

const setHtmlPageLang = (locale: string = 'zh-CN') => {
  const htmlElement = document.querySelector('html');

  if (htmlElement) {
    htmlElement.setAttribute('lang', locale);
  }
}

const setLang = (lang: string) => {
  if (lang === currentLang.value) return
  locale.value = lang
  // 设置lang
  localStore.setLang(lang)
  // 修改html中lang
  setHtmlPageLang(lang)
}
</script>

<template>
  <ElDropdown trigger="click" @command="setLang">
    <div class="i-ph:translate cursor-pointer w-6 h-6 text-white" />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in localeMap" :key="item.lang" :command="item.lang">
          {{ item.name }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
