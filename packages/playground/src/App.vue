<script setup >

import {darkTheme, dateZhCN, useOsTheme, zhCN ,NConfigProvider} from "naive-ui";
import {ref, watch} from "vue";
import Index from "./index.vue";
const osTheme = useOsTheme()
const theme = ref()
const isDarkTheme = ref(false)

watch(osTheme, val => {
  isDarkTheme.value = val === 'dark'
  theme.value = isDarkTheme.value? darkTheme: null
},{
  immediate: true
})

</script>

<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN" style="height: 100%">
    <index :dark="isDarkTheme"/>
  </n-config-provider>
</template>

<style scoped>

</style>
