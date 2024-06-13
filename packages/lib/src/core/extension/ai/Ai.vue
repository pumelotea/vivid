<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { h, ref, PropType } from "vue";
	import {
		NButton,
		NDropdown,
		NSpace,
		NIcon,
		NCard,
		NInput,
		NModal,
		useMessage,
		useDialog,
		useThemeVars,
	} from "naive-ui";
	import { Icon } from "@iconify/vue";
	import { AiOption } from "@lib/core/extension";
	import { useEditorInstance } from "../utils/common";
	import { Stream } from "openai/streaming";
	import OpenAI from "openai/index";
	import ChatCompletionChunk = OpenAI.ChatCompletionChunk;

	const props = defineProps({
		options: {
			type: Object as PropType<AiOption>,
			required: true,
		},
	});

	const vars = useThemeVars();
	const editorInstance = useEditorInstance();
	const options: any[] = [
		{
			label: "AI续写",
			icon: "mdi:magic",
			key: "xuxie",
		},
		{
			label: "AI润色",
			icon: "mdi:magic-staff",
			key: "runse",
			children: [
				{
					label: "更加详细",
					icon: "mdi:magic-staff",
					key: "xiangxi",
				},
				{
					icon: "mdi:magic-staff",
					label: "更加精简",
					key: "jingjian",
				},
				{
					icon: "mdi:magic-staff",
					label: "更加正式",
					key: "zhengshi",
				},
				{
					label: "更加连贯",
					icon: "mdi:magic-staff",
					key: "lianguan",
				},
				{
					icon: "mdi:magic-staff",
					label: "更加生动",
					key: "shengdong",
				},
			],
		},
		{
			label: "AI校阅",
			key: "jiaoyue",
			icon: "mdi:file-document-box-search-outline",
		},
		{
			label: "AI翻译",
			icon: "mdi:translate",
			key: "fanyi",
			children: [
				{
					label: "英语",
					icon: "mdi:translate",
					key: "english",
				},
				{
					label: "中文",
					icon: "mdi:translate",
					key: "chinese",
				},
			],
		},
	];
	const message = useMessage();
	const dialog = useDialog();
	const status = ref("idle");
	const result = ref("");
	const messageList = ref<string[]>([]);
	const showModal = ref(false);
	const storage = editorInstance.value.storage;
	let selectionFrom: number;
	let selectionTo: number;
	let stream: Stream<ChatCompletionChunk>;

	function renderDropdownIcon(item) {
		return h(NIcon, { size: 18 }, { default: () => h(Icon, { icon: item.icon }) });
	}

	async function handleSelect(key: string) {
		showModal.value = true;
		const selection = editorInstance.value.state.selection;
		const state = editorInstance.value.state;
		selectionFrom = state.selection.from;
		selectionTo = state.selection.to;
		const selectionText = state.doc.textBetween(selectionFrom, selectionTo);
		const selectionJSON =
			selectionText.length === 0 ? null : state.selection.content().content.toJSON();
		const prevText = state.doc.textBetween(Math.max(0, selectionTo - 5000), selectionTo, "\n");
		status.value = "loading";
		editorInstance.value.commands.focus();

		stream = await props.options.completions(selectionText, key);
		status.value = "generating";
		for await (const chunk of stream) {
			messageList.value.push(chunk.choices[0]?.delta?.content || "");
			result.value += chunk.choices[0]?.delta?.content || "";
		}
		status.value = "completed";
	}

	function handleStop() {
		status.value = "idle";
	}

	function handleReplace() {
		const range = {
			from: Number(selectionFrom),
			to: Number(selectionTo),
		};
		editorInstance.value
			.chain()
			.setTextSelection(range)
			.deleteSelection()
			.insertContent(result.value)
			.run();
		reset();
	}

	function reset() {
		result.value = "";
		messageList.value = [];
		status.value = "idle";
		showModal.value = false;
	}

	function copy(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			message.success("复制成功");
		});
	}

	function handleCancel() {
		stream && stream.controller.abort();
		reset();
	}
</script>

<template>
	<div v-if="editorInstance">
		<n-dropdown
			:to="false"
			:z-index="9999"
			placement="bottom-start"
			trigger="hover"
			:options="options"
			:render-icon="renderDropdownIcon"
			@select="handleSelect"
		>
			<vivid-menu-item
				icon="sparkling-line"
				title="AI助手"
				:action="() => {}"
				:is-active="() => {}"
			/>
		</n-dropdown>
		<n-modal @mask-click="handleCancel" style="width: 600px" v-model:show="showModal">
			<n-card title="AI助手" size="small">
				<div :class="{ box: status === 'generating' }">
					<n-input
						placeholder="生成内容"
						:bordered="status !== 'generating'"
						show-count
						:autosize="{
							minRows: 3,
							maxRows: 10,
						}"
						type="textarea"
						v-model:value="result"
						:loading="status === 'generating'"
						:readonly="status === 'generating'"
						style="height: fit-content; z-index: 9"
					></n-input>
				</div>
				<template #footer>
					<n-space justify="end">
						<n-button @click="handleCancel" size="small" secondary>取消</n-button>
						<n-button @click="copy(result)" size="small" secondary v-if="status === 'completed'"
							>复制</n-button
						>
						<n-button
							@click="handleReplace"
							size="small"
							type="primary"
							secondary
							v-if="status === 'completed'"
							>替换
						</n-button>
					</n-space>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>

<style scoped>
	.box {
		position: relative;
		padding: 2px;
		box-sizing: border-box;
	}

	.box::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: 3px;
		background-image: linear-gradient(
			135deg,
			#ff0000,
			#ff7f00,
			#ffff00,
			#00ff00,
			#00ffff,
			#0000ff,
			#8b00ff
		);
		background-size: 400%; /* 背景放大，动画更明显 */
		animation: animate_box 5s linear infinite;
	}

	.box::after {
		content: "";
		position: absolute;
		inset: 2px;
		z-index: 1;
		border-radius: 3px;
		background: var(--n-color-popover);
	}

	@keyframes animate_box {
		0%,
		100% {
			background-position: 0%, 50%;
		}
		50% {
			background-position: 100%, 50%;
		}
	}
</style>
