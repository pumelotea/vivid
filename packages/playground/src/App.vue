<template>
	<div class="editor-wrap">
    <n-config-provider :theme="theme" style="height: 100%">
      <VividEditor></VividEditor>
    </n-config-provider>
	</div>
</template>

<style scoped>
.editor-wrap{
	height: 800px;
	padding: 30px;
	box-sizing: border-box;
}
</style>
<script setup>
import { NConfigProvider } from 'naive-ui'
import { darkTheme, useOsTheme } from 'naive-ui'
import { ref, watch } from 'vue'


const osTheme = useOsTheme()
const theme = ref(null)
const isDark = ref(false)
const isDarkTheme = ref(false)

watch(isDarkTheme, val => {
  if (val) {
    theme.value = darkTheme
    isDark.value = true
  } else {
    theme.value = null
    isDark.value = false
  }
})

watch(osTheme, val => {
  isDarkTheme.value = val === 'dark'
})

isDarkTheme.value = osTheme.value === 'dark'

</script>
