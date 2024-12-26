<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import { localeOptions } from 'src/i18n'


const { locale } = useI18n({useScope: 'global'})
locale.value = Cookies.get('lang') || 'zh-CN'

function changeLocale (lang: string) {
  locale.value = lang
  // 设置lang
  Cookies.set('lang', lang, {secure: true, sameSite: 'Lax'})
  // 修改html中lang
  const htmlElement = document.querySelector('html')

  if (htmlElement) {
    htmlElement.setAttribute('lang', lang)
  }
}
</script>

<template>
  <ElDropdown trigger="click" @command="changeLocale">
    <ElButton title="language" type="default" link>
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
