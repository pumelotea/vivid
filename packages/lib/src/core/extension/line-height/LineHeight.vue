<template>
	<div v-if="editorInstance">
		<n-popselect
			v-model:value="value"
			:options="LineHeights"
			trigger="click"
			:on-update:value="toggleLineHeight"
		>
			<slot>
				<vivid-menu-item icon="line-height" title="行高" :action="() => {}" />
			</slot>
		</n-popselect>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { NPopselect } from "naive-ui";
	import { useLineHeight } from "./index.js";
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();
	injectExtension(useLineHeight());

	function percentageToDecimal(percentageString: string) {
		// 去掉百分号并转换成数字
		const percentage = parseFloat(percentageString.replace("%", ""));
		// 将百分比转换成小数
		return percentage / 100;
	}

	const LineHeights = computed(() => {
		const lineHeightOptions =
			editorInstance.value.extensionManager.extensions.find(
				(e) => e.name === "lineHeight",
			)!.options;
		const a = lineHeightOptions.lineHeights;
		const b = a.map((item) => ({
			label: percentageToDecimal(item),
			value: item,
		}));
		b.unshift({
			label: "默认",
			value: "default",
		});
		return b;
	});

	const value = ref("default");

	function toggleLineHeight(key: string) {
		if (key === "default") {
			editorInstance.value.commands.unsetLineHeight();
		} else {
			editorInstance.value.commands.setLineHeight(key);
		}
		value.value = key;
	}
</script>
