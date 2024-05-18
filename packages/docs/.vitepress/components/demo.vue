<script setup>
import {computed, ref, watch} from "vue";
import {useMutationObserver} from "@vueuse/core";
import {zhCN, dateZhCN, NConfigProvider, NInput, darkTheme, useOsTheme} from "naive-ui";
const text = ref("");
const theme = computed(() => {
	if (dark.value) {
		return darkTheme
	}
	return null
});
const osTheme = useOsTheme();
const dom = document.querySelector('html');
const dark = ref(false);
watch(osTheme, (val) => {
	dark.value = val === 'dark'
});

function updateTheme() {
	dark.value = dom.classList.contains('dark')
}

const observer = useMutationObserver(dom, (mutations) => {
	updateTheme()
}, {
	attributes: true,
});

updateTheme()
</script>
<template>
	<n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN" style="height: 100%">
		<div style="display: flex;justify-content: center;flex-direction: column;align-items: center">
			<div style="padding: 40px;max-width:1280px;height: 600px">
				<vivid-editor v-model="text" :dark="dark"/>
			</div>
			<div title="输出内容" style="padding: 40px;max-width:1280px;width: 100%">
				<n-input
					v-model:value="text"
					type="textarea"
				/>
			</div>
		</div>
	</n-config-provider>
</template>

<style scoped>

</style>
