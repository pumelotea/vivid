<script setup lang="ts">
	import "highlight.js/styles/atom-one-light.css";
	import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
	import { NPopselect, NButton } from "naive-ui";
	import { onMounted, ref, watch } from "vue";

	const props = defineProps(nodeViewProps);

	const languages = props.extension.options.lowlight.listLanguages().map((e) => {
		return {
			label: e,
			value: e,
		};
	});

	languages.unshift({
		label: "auto",
		value: "auto",
	});

	const selectedLanguage = ref(props.node.attrs.language);

	watch(selectedLanguage, () => {
		if (selectedLanguage.value === "auto") {
			props.updateAttributes({ language: null });
		} else {
			props.updateAttributes({ language: selectedLanguage.value });
		}
	});

	watch(
		() => props.node.attrs.language,
		() => {
			selectedLanguage.value = props.node.attrs.language;
		},
	);

	onMounted(() => {
		selectedLanguage.value = props.node.attrs.language;
	});
</script>
<template>
	<node-view-wrapper class="code-block" as="p">
		<div class="lang-select" contenteditable="false">
			<n-popselect
				:disabled="!props.editor.isEditable"
				v-model:value="selectedLanguage"
				:options="languages"
				trigger="click"
				style="max-height: 300px; overflow: auto"
			>
				<n-button text type="info" size="small">
					{{ selectedLanguage || "auto" }}
				</n-button>
			</n-popselect>
		</div>
		<pre><node-view-content /></pre>
	</node-view-wrapper>
</template>

<style scoped>
	.code-block {
		position: relative;
	}

	.code-block .lang-select {
		position: absolute;
		top: 0;
		right: 0;
		border-radius: 4px;
		padding: 0 10px;
	}
</style>
