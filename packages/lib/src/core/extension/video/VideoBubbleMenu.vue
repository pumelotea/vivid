<script setup lang="ts">
	import { NSpace } from "naive-ui";
	import VividMenuItem from "../../../core/components/VividMenuItem.vue";
	import { deleteSelection } from "@tiptap/pm/commands";
	import SvgIcon from "@jamescoyle/vue-icon/lib/svg-icon.vue";
	import {
		mdiFormatFloatLeft,
		mdiFormatFloatRight,
		mdiFormatFloatNone,
		mdiSizeM,
		mdiSizeL,
		mdiSizeS,
	} from "@mdi/js";
	import { useEditorInstance } from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();

	const display = ["left", "inline", "right"];

	function deleteVideo() {
		const { state, dispatch } = editorInstance.value.view;
		deleteSelection(state, dispatch);
	}

	function toggleKeepRatio() {
		if (editorInstance.value.isActive("video", { keepRatio: true })) {
			editorInstance.value.chain().focus().updateVideo({ keepRatio: false }).run();
		} else {
			editorInstance.value.chain().focus().updateVideo({ keepRatio: true }).run();
		}
	}

	function toggleControls() {
		if (editorInstance.value.isActive("video", { controls: true })) {
			editorInstance.value.chain().focus().updateVideo({ controls: false }).run();
		} else {
			editorInstance.value.chain().focus().updateVideo({ controls: true }).run();
		}
	}

	function toggleLoop() {
		if (editorInstance.value.isActive("video", { loop: true })) {
			editorInstance.value.chain().focus().updateVideo({ loop: false }).run();
		} else {
			editorInstance.value.chain().focus().updateVideo({ loop: true }).run();
		}
	}

	function toggleMuted() {
		if (editorInstance.value.isActive("video", { muted: true })) {
			editorInstance.value.chain().focus().updateVideo({ muted: false }).run();
		} else {
			editorInstance.value.chain().focus().updateVideo({ muted: true }).run();
		}
	}
</script>

<template>
	<div>
		<n-space :size="2">
			<vivid-menu-item
				title="左侧浮动"
				:action="
					() =>
						editorInstance
							.chain()
							.focus()
							.updateVideo({ display: display[0] })
							.run()
				"
				:isActive="
					() => editorInstance.isActive('video', { display: display[0] })
				"
			>
				<svg-icon type="mdi" :path="mdiFormatFloatLeft"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="行内"
				:action="
					() =>
						editorInstance
							.chain()
							.focus()
							.updateVideo({ display: display[1] })
							.run()
				"
				:isActive="
					() => editorInstance.isActive('video', { display: display[1] })
				"
			>
				<svg-icon type="mdi" :path="mdiFormatFloatNone"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="右侧浮动"
				:action="
					() =>
						editorInstance
							.chain()
							.focus()
							.updateVideo({ display: display[2] })
							.run()
				"
				:isActive="
					() => editorInstance.isActive('video', { display: display[2] })
				"
			>
				<svg-icon type="mdi" :path="mdiFormatFloatRight"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="小型尺寸"
				:action="
					() => editorInstance.chain().focus().updateVideo({ width: 200 }).run()
				"
				:isActive="() => editorInstance.isActive('video', { width: 200 })"
			>
				<svg-icon type="mdi" :path="mdiSizeS"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="中型尺寸"
				:action="
					() => editorInstance.chain().focus().updateVideo({ width: 500 }).run()
				"
				:isActive="() => editorInstance.isActive('video', { width: 500 })"
			>
				<svg-icon type="mdi" :path="mdiSizeM"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				title="铺满"
				:action="
					() =>
						editorInstance.chain().focus().updateVideo({ width: '100%' }).run()
				"
				:isActive="() => editorInstance.isActive('video', { width: '100%' })"
			>
				<svg-icon type="mdi" :path="mdiSizeL"></svg-icon>
			</vivid-menu-item>
			<vivid-menu-item
				icon="aspect-ratio-line"
				title="锁定比例"
				:action="toggleKeepRatio"
				:isActive="() => editorInstance.isActive('video', { keepRatio: true })"
			/>
			<vivid-menu-item
				icon="equalizer-2-line"
				title="显示控件"
				:action="toggleControls"
				:isActive="() => editorInstance.isActive('video', { controls: true })"
			/>
			<vivid-menu-item
				icon="repeat-2-line"
				title="循环播放"
				:action="toggleLoop"
				:isActive="() => editorInstance.isActive('video', { loop: true })"
			/>
			<vivid-menu-item
				icon="volume-mute-line"
				title="静音"
				:action="toggleMuted"
				:isActive="() => editorInstance.isActive('video', { muted: true })"
			/>
			<vivid-menu-item
				icon="delete-bin-line"
				title="删除"
				:action="deleteVideo"
			/>
		</n-space>
	</div>
</template>
