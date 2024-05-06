<template>
	<div class="editor-wrap">
    <n-config-provider :theme="theme" style="height: 100%">
      <VividEditor></VividEditor>
    </n-config-provider>
	</div>
</template>

<style scoped>
.editor-wrap{
	height: 100vh;
	padding: 30px;
	box-sizing: border-box;
}
</style>
<script setup>
import { NConfigProvider } from 'naive-ui'
import { darkTheme, useOsTheme } from 'naive-ui'
import { nextTick, ref, watch } from 'vue'
import { useHocuspocus, useDefaultExtension,getRandomColor } from '@codecoderun/vivid'


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


const ved = ref()
const extList = useDefaultExtension()
function onBeforeCreate(){
	let isFirst = true
	const ho = useHocuspocus({
		url                   : 'wss://ws.codecode.run/',
		name                  : 'clqnia8cy000tl801q7p4yjqk',
		token                 : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNscDJrZmE4dTAwMDBweDB4aXlpam1rYmkiLCJ1c2VybmFtZSI6InJvb3QiLCJwYXNzd29yZCI6IiQyYSQxMCRpZHVLLlhUVE5jTmlzdEtjRXVPWXZPRUtWbTNQazdFSW8vbXNoQnNSVTh3V0d1cHNnTFcwVyIsInNhbHQiOm51bGwsIm5hbWUiOiIiLCJuaWNrbmFtZSI6IuacseWzsCIsImF2YXRhciI6Ii9hdmF0YXIvS054QzBqbHQ2TGk1UDhZWjB6dHMucG5nIiwiaXNFbmFibGUiOnRydWUsInBob25lTnVtYmVyIjoiMTM0NTYyNzUyNTIiLCJjcmVhdGVkQXQiOiIyMDIzLTExLTE3VDExOjU3OjIyLjIwNFoiLCJjcmVhdGVkQnkiOm51bGwsInVwZGF0ZWRBdCI6IjIwMjMtMTItMDZUMTM6MTk6NTAuNjI1WiIsInVwZGF0ZWRCeSI6ImNscDJrZmE4dTAwMDBweDB4aXlpam1rYmkiLCJkZWxldGVkIjpudWxsLCJkZWxldGVkQnkiOm51bGwsImlhdCI6MTcxNDIyMjM5OSwiZXhwIjoxNzE0Mzk1MTk5fQ.YmXJTwvspXnJboSpJdKCsGJu_4hrQ0U0OaRJrwhhd-I',
		onAuthenticationFailed: () => {
			alert('无权限')
		},
		onSynced: () => {
			nextTick(() => {
				if (isFirst) {
					ved.value.getInstance().commands.focus('start')
					isFirst = false
				}
			})
		},
		onAwarenessUpdate: (data) => {
			console.log(data)
		}
	},{
		name  : '外星人',
		color : getRandomColor(),
		avatar: ''
	})
	extList.push(...ho)
}

</script>
