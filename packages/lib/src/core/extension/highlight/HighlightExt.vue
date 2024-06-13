<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { ref, PropType } from "vue";
	import { HighlightOptions } from "@tiptap/extension-highlight";
	import VividColorPicker from "../../components/VividColorPicker.vue";
	import { useHighlight } from "./highlight";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<HighlightOptions>>,
			required: false,
			default: () => {
				return { multicolor: true };
			},
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(useHighlight(props.options));

	const colorHighlight = ref("#fec300");

	function setHighlightColor() {
		editorInstance.value.chain().focus().toggleHighlight({ color: colorHighlight.value }).run();
	}

	function updateHeightColor(newColor: string) {
		colorHighlight.value = newColor;
		editorInstance.value.chain().focus().setHighlight({ color: colorHighlight.value }).run();
	}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<div class="color-box">
				<vivid-menu-item
					icon="mark-pen-line"
					title="高亮"
					:action="setHighlightColor"
					:is-active="() => editorInstance.isActive('highlight')"
				/>
				<vivid-color-picker :default-color="colorHighlight" @change="updateHeightColor" />
			</div>
		</slot>
	</div>
</template>

<style scoped>
	.color-box {
		display: flex;
	}
</style>
