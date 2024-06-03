<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { useThemeVars } from "naive-ui";
	import { useEditorInstance } from "@lib/core/extension/utils/common";
	import { overwriteKeyDown, useSlashCommandData } from "@lib/core/extension/slash-command/slash-command";
	import { SuggestionKeyDownProps } from "@tiptap/suggestion/src/suggestion";

	const vars = useThemeVars();

	const editor = useEditorInstance();

	const data = useSlashCommandData();

	const items = ref([
    {
      name: "插入链接",
      cmd: "/link",
      icon: "link",
      action: () => {
        if (!data.value.range) {
          return;
        }
        editor.value.chain().focus().deleteRange(data.value.range).run();
        editor.value.storage.link.openLink();
      },
    },
		{
			name: "插入图片",
			cmd: "/img",
			icon: "image-line",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).run();
				editor.value.storage.image.openUploader();
			},
		},
		{
			name: "插入视频", cmd: "/video", icon: "video-line", action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).run();
				editor.value.storage.video.openUploader();
			},
		},
		{
			name: "引用",
			cmd: "/b",
			icon: "double-quotes-l",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleBlockquote().run();
			},
		},
		{
			name: "标题1",
			cmd: "/h1",
			icon: "h-1",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleHeading({ level: 1 }).run();
			},
		},
		{
			name: "标题2",
			cmd: "/h2",
			icon: "h-2",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleHeading({ level: 2 }).run()
			},
		},
		{
			name: "标题3",
			cmd: "/h3",
			icon: "h-3",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleHeading({ level: 3 }).run();
			},
		},
		{
			name: "列表",
			cmd: "/list",
			icon: "list-unordered",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleBulletList().run();
			},
		},
		{
			name: "数学公式", cmd: "/math", icon: "functions", action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).run();
				editor.value.storage["hb-math"].openEditor();
			},
		},
		{
			name: "代码",
			cmd: "/code",
			icon: "brackets-line",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleCode().run();
			},
		},
		{
			name: "代码块",
			cmd: "/codeblock",
			icon: "code-view",
			action: () => {
				if (!data.value.range) {
					return;
				}
				editor.value.chain().focus().deleteRange(data.value.range).toggleCodeBlock().run();
			},
		},
	]);

	const renderList = computed(() => {
		return items.value.filter(e => e.cmd.startsWith(`/${data.value.query}`));
	});

	const selectedIndex = ref(-1);

	watch(() => data.value.query, () => {
		selectedIndex.value = -1;
	});

	function onKeyDown({ event }: SuggestionKeyDownProps) {
		if (event.key === "Enter") {
			const cmd = renderList.value[selectedIndex.value];
			if (cmd) {
				cmd.action();
			}
			if (renderList.value.length === 1) {
				renderList.value[0].action();
			}
			return true;
		}
		if (event.key === "ArrowDown") {
			selectedIndex.value++;
			if (renderList.value.length === 0) {
				selectedIndex.value = -1;
				return true;
			}
			if (selectedIndex.value > renderList.value.length - 1) {
				selectedIndex.value = 0;
				return true;
			}
			return true;
		}
		if (event.key === "ArrowUp") {
			selectedIndex.value--;
			if (renderList.value.length === 0) {
				selectedIndex.value = -1;
				return true;
			}
			if (selectedIndex.value < 0) {
				selectedIndex.value = renderList.value.length - 1;
				return true;
			}
			return true;
		}
		return false;
	}

	overwriteKeyDown(onKeyDown);

</script>

<template>
	<div class="slash-command" v-show="renderList.length > 0">
		<div class="slash-item" v-for="(e, i) in renderList" @click="e.action()" :key="e.cmd"
				 :class="{'active':selectedIndex === i}">
			<div class="slash-name">
				<div class="slash-icon">
					<i :class="`ri-${e.icon}`"></i>
				</div>
				<span>{{ e.name }}</span>
			</div>
			<div class="slash-command-value">
				{{ e.cmd }}
			</div>
		</div>
	</div>
</template>

<style scoped>
	.slash-command {
		background: v-bind(vars.popoverColor);
		width: 180px;
		border-radius: 5px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		box-shadow: v-bind(vars.boxShadow3);
		outline: none;
		border: none;
		user-select: none;
	}

	.slash-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 10px;
		transition: all 0.5s;
	}

	.slash-item:hover {
		background: v-bind(vars.hoverColor);
	}

	.slash-item.active {
		background: v-bind(vars.hoverColor);
	}

	.slash-name {
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 14px;
		color: v-bind(vars.textColor2);
	}

	.slash-command-value {
		font-size: 10px;
		color: v-bind(vars.textColor1);
		border: 1px solid v-bind(vars.borderColor);
		border-radius: 4px;
		opacity: 0.4;
		padding: 2px 6px;
		box-sizing: border-box;
	}

	.slash-icon {
		border: 1px solid v-bind(vars.borderColor);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 5px;
	}
</style>
