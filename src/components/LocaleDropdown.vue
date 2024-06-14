<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from 'stores/modules/app'

// 多语言相关
const appStore = useAppStore()

const { locale } = useI18n()

const currentLang = computed(() => appStore.getLocale)
const languages = computed(() => appStore.getLocaleMap)

const setHtmlPageLang = (locale: string) => {
  document.querySelector('html')?.setAttribute('lang', locale)
}

const setLang = (lang: string) => {
  if (lang === currentLang.value) return
  locale.value = lang
  // 设置lang
  appStore.setLocale(lang)
  // 修改html中lang
  setHtmlPageLang(lang)
}
</script>

<template>
  <ElDropdown trigger="click" @command="setLang">
    <div class="i-ph:translate cursor-pointer w-6 h-6 text-white" />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in languages" :key="item.lang" :command="item.lang">
          {{ item.name }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
