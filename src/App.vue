<script setup lang="ts">
// import { watch } from 'vue'
// import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'


// const { locale } = useI18n({useScope: 'global'})
// const modules = import.meta.glob('../../node_modules/element-plus/es/locale/lang/(zh-cn|zh-tw|en).mjs')

// watch(locale, async (val) => {
//   if (val === 'en-US') {
//     val = 'en'
//   }
//   const loadLangModule = modules[`../../node_modules/element-plus/es/locale/lang/${val.toLowerCase()}.mjs`]
//   if (loadLangModule) {
//     const langModule = await loadLangModule()
//     locale.value = langModule.default
//   }
// })
</script>

<template>
  <ElConfigProvider :locale="$i18n.locale === 'zh-CN' ? zhCn : $i18n.locale === 'zh-TW' ? zhTw : en" :message="{ max: 1 }">
    <RouterView />
  </ElConfigProvider>
</template>
