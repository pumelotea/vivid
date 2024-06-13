<script setup lang="ts">
	import { NPopover, NElement, useThemeVars } from "naive-ui";
	import {
		lockDragHandle,
		unlockDragHandle,
		useDragHandle,
		useDragHandleData,
	} from "./drag-handle";
	import { onMounted, ref, watch } from "vue";
	import { Range } from "@tiptap/core";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";
	import { DOMSerializer, Node } from "prosemirror-model";

	const vars = useThemeVars();
	const root = ref<any>();
	const showSlash = ref(false);
	const showPop = ref(false);

	const editorInstance = useEditorInstance();
	const data = useDragHandleData();
	const container = document.createElement("div");
	injectExtension(useDragHandle({ element: container }));

	onMounted(() => {
		container.append(root.value);
	});

	const items = ref([
		{
			name: "插入段落",
			cmd: "/paragraph",
			icon: "paragraph",
			action: (range: Range) => {
				if (!data.value.range) {
					return;
				}
				editorInstance.value.chain().focus().insertContentAt(range.to, "<p></p>").run();
			},
		},
		{
			name: "插入链接",
			cmd: "/link",
			icon: "link",
			action: (range: Range) => {
				if (!data.value.range) {
					return;
				}
				editorInstance.value.chain().focus().insertContentAt(range.to, "<p></p>").run();
				editorInstance.value.storage.link.openLink();
			},
		},
		{
			name: "插入图片",
			cmd: "/img",
			icon: "image-line",
			action: (range: Range) => {
				editorInstance.value.chain().insertContentAt(range.to, "<p></p>").focus().run();
				editorInstance.value.storage.image.openUploader();
			},
		},
		{
			name: "插入视频",
			cmd: "/video",
			icon: "video-line",
			action: (range: Range) => {
				editorInstance.value.chain().focus().insertContentAt(range.to, "<p></p>").run();
				editorInstance.value.storage.video.openUploader();
			},
		},
		{
			name: "引用",
			cmd: "/b",
			icon: "double-quotes-l",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.focus()
					.insertContentAt(range.to, "<p></p>")
					.toggleBlockquote()
					.run(),
		},
		{
			name: "标题1",
			cmd: "/h1",
			icon: "h-1",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.focus()
					.insertContentAt(range.to, "<p></p>")
					.setHeading({ level: 1 })
					.run(),
		},
		{
			name: "标题2",
			cmd: "/h2",
			icon: "h-2",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.insertContentAt(range.to, "<p></p>")
					.setHeading({ level: 2 })
					.run(),
		},
		{
			name: "标题3",
			cmd: "/h3",
			icon: "h-3",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.insertContentAt(range.to, "<p></p>")
					.setHeading({ level: 3 })
					.run(),
		},
		{
			name: "列表",
			cmd: "/list",
			icon: "list-unordered",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.focus()
					.insertContentAt(range.to, "<p></p>")
					.toggleBulletList()
					.run(),
		},
		{
			name: "数学公式",
			cmd: "/math",
			icon: "functions",
			action: (range: Range) => {
				editorInstance.value.chain().focus().insertContentAt(range.to, "<p></p>").run();
				editorInstance.value.storage["hb-math"].openEditor();
			},
		},
		{
			name: "代码",
			cmd: "/code",
			icon: "brackets-line",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.focus()
					.insertContentAt(range.to, "<p></p>")
					.toggleCode()
					.run(),
		},
		{
			name: "代码块",
			cmd: "/codeblock",
			icon: "code-view",
			action: (range: Range) =>
				editorInstance.value
					.chain()
					.focus()
					.insertContentAt(range.to, "<p></p>")
					.toggleCodeBlock()
					.run(),
		},
	]);
	const items2 = ref([
		{
			name: "上移一行",
			icon: "arrow-up-s-line",
			action: (range: Range) => {
				if (!data.value.preRange) {
					return;
				}
				const editor = editorInstance.value;
				const state = editorInstance.value.state;
				const tr = state.tr;
				const range1 = { ...data.value.preRange }; // 第二个 range 的位置
				const range2 = { ...range }; // 第一个 range 的位置
				const fromNode = state.doc.cut(range1.from, range1.to);
				const toNode = state.doc.cut(range2.from, range2.to);
				tr.replaceRangeWith(range2.from, range2.to, fromNode);
				tr.replaceRangeWith(range1.from, range1.to, toNode);
				editor.view.dispatch(tr);
			},
		},
		{
			name: "删除本行",
			icon: "close-line",
			action: (range: Range) => {
				const editor = editorInstance.value;
				const state = editorInstance.value.state;
				const tr = state.tr;
				tr.delete(range.from, range.to).scrollIntoView();
				editorInstance.value.view.dispatch(tr);
			},
		},
		{
			name: "复制本行",
			icon: "file-copy-line",
			action: (range: Range) => {
				const editor = editorInstance.value;
				if (data.value.node) {
					editor.commands.copyRange(range, data.value.node);
				}
			},
		},
		{
			name: "下移一行",
			icon: "arrow-down-s-line",
			action: (range: Range) => {
				if (!data.value.nextRange) {
					return;
				}
				const editor = editorInstance.value;
				const state = editorInstance.value.state;
				const tr = state.tr;
				const range1 = { ...range }; // 第一个 range 的位置
				const range2 = { ...data.value.nextRange }; // 第二个 range 的位置
				const fromNode = state.doc.cut(range1.from, range1.to);
				const toNode = state.doc.cut(range2.from, range2.to);
				tr.replaceRangeWith(range2.from, range2.to, fromNode);
				tr.replaceRangeWith(range1.from, range1.to, toNode);
				editor.view.dispatch(tr);
			},
		},
	]);

	function doAction(e: any) {
		if (data.value.rect) {
			e.action(data.value.range);
			showSlash.value = false;
			showPop.value = false;
		}
	}

	watch([showSlash, showPop], () => {
		if (showSlash.value || showPop.value) {
			lockDragHandle();
		} else {
			unlockDragHandle();
		}
	});
</script>

<template>
	<div style="display: none">
		<div class="drag-handle" ref="root">
			<n-popover
				:z-index="99999"
				style="padding: 0; border-radius: 10px"
				v-model:show="showSlash"
				trigger="click"
				placement="bottom-start"
				:show-arrow="false"
			>
				<template #trigger>
					<n-element class="drag-button">
						<i class="ri-add-fill"></i>
					</n-element>
				</template>
				<slot name="drag-handle-slash">
					<n-element class="slash-command">
						<div class="slash-item" v-for="(e, i) in items" @click="doAction(e)" :key="e.cmd">
							<div class="slash-name">
								<div class="slash-icon">
									<i :class="`ri-${e.icon}`"></i>
								</div>
								<span>{{ e.name }}</span>
							</div>
						</div>
					</n-element>
				</slot>
			</n-popover>
			<n-popover
				:z-index="99999"
				style="padding: 0; border-radius: 10px"
				v-model:show="showPop"
				trigger="click"
				placement="bottom-start"
				:show-arrow="false"
			>
				<template #trigger>
					<n-element class="drag-button">
						<i class="ri-draggable"></i>
					</n-element>
				</template>
				<slot name="drag-handle-select">
					<n-element class="slash-command">
						<div class="slash-item" v-for="(e, i) in items2" @click="doAction(e)" :key="e.name">
							<div class="slash-name">
								<div class="slash-icon">
									<i :class="`ri-${e.icon}`"></i>
								</div>
								<span>{{ e.name }}</span>
							</div>
						</div>
					</n-element>
				</slot>
			</n-popover>
		</div>
	</div>
</template>

<style scoped>
	.slash-command {
		width: 160px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		outline: none;
		border: none;
		user-select: none;
		border-radius: 10px;
		overflow: hidden;
	}

	.slash-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 10px;
		transition: all 0.5s;
	}

	.slash-item:hover {
		background: var(--hover-color);
	}

	.slash-name {
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 14px;
	}

	.slash-icon {
		border: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 5px;
	}

	.drag-handle {
		align-items: center;
		gap: 2px;
		display: flex;
	}

	.drag-button {
		width: 24px;
		height: 24px;
		border-radius: 5px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-color3);
	}

	.drag-button:hover {
		background: var(--hover-color);
		border: 1px solid var(--border-color);
	}
</style>
