<script setup lang="ts">
	import { ref } from "vue";
	import tippy, { Instance } from "tippy.js";

	import {
		keyDownFn,
		overwriteItems, overwriteRender,
		useSlashCommand, useSlashCommandData,
	} from "./slash-command";
	import VividSlashCommand from "./DefaultSlashCommandView.vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const root = ref();
	let tippyInstance: Instance;
	const editorInstance = useEditorInstance();
	injectExtension(useSlashCommand());

	const data = useSlashCommandData();

	overwriteItems((query) => {
		data.value.query = query;
		return []
	});

	overwriteRender(() => {
		return {
			onStart: props => {
				data.value.range = props.range
				data.value.editor = props.editor
				createTooltip(props.clientRect!() as DOMRect)
			},
			onUpdate: props => {
				data.value.range = props.range
				updateTooltip(props.clientRect!() as DOMRect)
			},
			onKeyDown: props => {
				if (props.event.key === 'Escape') {
					destroyTooltip()
					return true
				}
				data.value.range = props.range
				if (keyDownFn){
					return keyDownFn(props)
				}
				return false
			},
			onExit: props => {
				destroyTooltip()
			},
		};
	});

	function createTooltip(clientRect: DOMRect) {
		if (!root.value) {
			return;
		}
		const container = document.createElement("div");
		container.append(root.value);
		tippyInstance = tippy("body", {
			duration: 0,
			getReferenceClientRect: () => clientRect,
			content: container,
			interactive: true,
			trigger: "manual",
			placement: "bottom-start",
		})[0];
		tippyInstance.show()
	}

	function updateTooltip(clientRect: DOMRect){
		if (!tippyInstance){
			return
		}
		tippyInstance.setProps({
			getReferenceClientRect: () => clientRect
		})
	}

	function destroyTooltip() {
		if (tippyInstance) {
			tippyInstance.destroy();
			data.value.range = undefined
			data.value.query = undefined
		}
	}

</script>

<template>
	<div style="display: none">
		<div ref="root">
			<slot>
				<vivid-slash-command v-if="editorInstance && editorInstance.isEditable" />
			</slot>
		</div>
	</div>
</template>
