<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import VividColorPicker from "../../components/VividColorPicker.vue";
	import Color, { ColorOptions } from "@tiptap/extension-color";
	import { PropType, ref } from "vue";
	import { useEditorInstance, injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<ColorOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Color.configure(props.options));

	const color = ref("#000000");

	function setColor() {
		editorInstance.value.chain().focus().setColor(color.value).run();
	}

	function updateColor(newColor: string) {
		color.value = newColor;
		setColor();
	}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<div class="color-box">
				<vivid-menu-item
					icon="font-color"
					title="字体颜色"
					:action="setColor"
					:is-active="() => editorInstance.isActive('font-color')"
				/>
				<vivid-color-picker @change="updateColor" />
			</div>
		</slot>
	</div>
</template>

<style scoped>
	.color-box {
		display: flex;
	}
</style>
