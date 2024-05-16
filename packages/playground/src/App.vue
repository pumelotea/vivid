<script setup >

import {darkTheme, dateZhCN, useOsTheme, zhCN ,NConfigProvider} from "naive-ui";
import {ref, watch} from "vue";
import Index from "./index.vue";
const osTheme = useOsTheme()
const theme = ref(null)
const isDarkTheme = ref(false)

watch(isDarkTheme, val => {
  if (val) {
    theme.value = darkTheme
  } else {
    theme.value = null
  }
})
watch(osTheme, val => {
  isDarkTheme.value = val === 'dark'
},{
  immediate: true
})

</script>

<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN" style="height: 100%">
    <index/>
  </n-config-provider>
</template>

<style scoped>

</style>
