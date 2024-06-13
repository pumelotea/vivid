<script setup lang="ts">
	import { NSpace } from "naive-ui";
	import VividMenuItem from "../../../core/components/VividMenuItem.vue";
	import SvgIcon from "@jamescoyle/vue-icon/lib/svg-icon.vue";
	import {
		mdiFormatFloatLeft,
		mdiFormatFloatRight,
		mdiFormatFloatNone,
		mdiSizeM,
		mdiSizeL,
		mdiSizeS,
	} from "@mdi/js";
	import { deleteSelection } from "prosemirror-commands";
	import { useEditorInstance } from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();

	function deleteImage() {
		const { state, dispatch } = editorInstance.value.view;
		deleteSelection(state, dispatch);
	}

	function toggleKeepRatio() {
		if (editorInstance.value.isActive("image", { keepRatio: true })) {
			editorInstance.value.chain().focus().updateImage({ keepRatio: false }).run();
		} else {
			editorInstance.value.chain().focus().updateImage({ keepRatio: true }).run();
		}
	}
</script>

<template>
	<div>
		<n-space :size="2">
			<vivid-menu-item
				title="左侧浮动"
				:action="() => editorInstance.chain().focus().updateImage({ display: 'left' }).run()"
				:isActive="() => editorInstance.isActive('image', { display: 'left' })"
			>
				<svg-icon type="mdi" :path="mdiFormatFloatLeft"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="行内"
				:action="() => editorInstance.chain().focus().updateImage({ display: 'inline' }).run()"
				:isActive="() => editorInstance.isActive('image', { display: 'inline' })"
			>
				<svg-icon type="mdi" :path="mdiFormatFloatNone"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="右侧浮动"
				:action="() => editorInstance.chain().focus().updateImage({ display: 'right' }).run()"
				:isActive="() => editorInstance.isActive('image', { display: 'right' })"
			>
				<svg-icon type="mdi" :path="mdiFormatFloatRight"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="小型尺寸"
				:action="() => editorInstance.chain().focus().updateImage({ width: 200 }).run()"
				:isActive="() => editorInstance.isActive('image', { width: 200 })"
			>
				<svg-icon type="mdi" :path="mdiSizeS"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="中型尺寸"
				:action="() => editorInstance.chain().focus().updateImage({ width: 500 }).run()"
				:isActive="() => editorInstance.isActive('image', { width: 500 })"
			>
				<svg-icon type="mdi" :path="mdiSizeM"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="铺满"
				:action="() => editorInstance.chain().focus().updateImage({ width: '100%' }).run()"
				:isActive="() => editorInstance.isActive('image', { width: '100%' })"
			>
				<svg-icon type="mdi" :path="mdiSizeL"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				icon="aspect-ratio-line"
				title="锁定比例"
				:action="toggleKeepRatio"
				:isActive="() => editorInstance.isActive('image', { keepRatio: true })"
			/>
			<vivid-menu-item icon="delete-bin-line" title="删除" :action="deleteImage" />
		</n-space>
	</div>
</template>
