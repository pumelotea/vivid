<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { PropType, ref } from "vue";
	import VividLinkModal from "./VividLinkModal.vue";
	import { useLink, VividLinkOptions } from "./link";
	import { getAttributes, getMarkRange } from "@tiptap/core";
	import {
		NCard,
		NInputGroup,
		NInput,
		NRadioGroup,
		NRadio,
		NForm,
		NFormItem,
		NButton,
		NSpace,
	} from "naive-ui";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";
	import { EditorView } from "prosemirror-view";
	import { MarkType } from "@tiptap/pm/model";
	import tippy, { Instance } from "tippy.js";
	import { TextSelection } from "@tiptap/pm/state";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<VividLinkOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();

	const root = ref<any>();
	const HTL = ref<any>(null);
	const isEdit = ref(false);
	const href = ref("");
	const target = ref("_blank");
	let tippyInstance: Instance;

	function handleOpenLink() {
		if (editorInstance.value.isActive("link")) {
			editorInstance.value.chain().focus().unsetLink().run();
		} else {
			HTL.value!.open();
		}
	}

	function setLink(text: string, href: string, target: string) {
		console.log(text, href, target);
		editorInstance.value.chain()
			.extendMarkRange("link")
			.insertContent({
				type: "text",
				text: text,
				marks: [
					{
						type: "link",
						attrs: {
							href: href,
							target: target,
						},
					},
				],
			})
			.setLink({ href: href })
			.focus()
			.run();
	}

	function handleLinkClick(view: EditorView, pos: number, event: MouseEvent, type: MarkType) {
		if (!view.editable) {
			return false;
		}
		if (event.button !== 0) {
			return false;
		}
		let a = event.target as HTMLElement;
		const els = [];
		while (a.nodeName !== "DIV") {
			els.push(a);
			a = a.parentNode as HTMLElement;
		}
		if (!els.find(value => value.nodeName === "A")) {
			return false;
		}
		const attrs = getAttributes(view.state, type.name);
		const link = (event.target as HTMLLinkElement);

		const node = view.state.doc.nodeAt(pos);
		if (node) {
			const linkNode = node.marks.filter(e => e.type.name === "link");
			if (linkNode.length) {
				const { schema, doc, tr } = view.state;
				const range = getMarkRange(doc.resolve(pos), schema.marks.link);
				if (!range) return false;
				const $start = doc.resolve(range.from);
				const $end = doc.resolve(range.to);
				const transaction = tr.setSelection(new TextSelection($start, $end));
				view.dispatch(transaction);
				destroyTooltip();
				createTooltip(link, attrs);

				return true;
			}
		}
		return false;
	}

	function createTooltip(linkElement: HTMLLinkElement, attrs: Record<string, any>) {
		if (!root.value) {
			return;
		}
		href.value = linkElement?.href ?? attrs.href;
		target.value = linkElement?.target ?? attrs.target;

		const container = document.createElement("div");
		container.append(root.value);
		tippyInstance = tippy("body", {
			duration: 0,
			getReferenceClientRect: () => linkElement.getBoundingClientRect(),
			content: container,
			interactive: true,
			trigger: "manual",
			placement: "bottom-start",
		})[0];
		tippyInstance.show();
	}

	function destroyTooltip() {
		if (tippyInstance) {
			tippyInstance.destroy();
		}
		isEdit.value = false;
	}

	injectExtension(useLink({
		handleClick: handleLinkClick,
		protocols: ["ftp", "mailto", "http", "https"],
		autolink: false,
	}));

	function onCancel() {
		destroyTooltip();
	}

	function unsetLink() {
		editorInstance.value.chain().focus().unsetLink().run();
		destroyTooltip();
	}

	function onOk() {
		editorInstance.value.chain()
			.extendMarkRange("link")
			.setLink({ href: href.value, target: target.value })
			.focus()
			.run();
		destroyTooltip();
	}

</script>

<template>
	<div>
		<slot>
			<vivid-menu-item
				icon="link"
				title="超链接"
				:action="handleOpenLink"
				:is-active="() => editorInstance?.isActive('link')"
			/>
			<vivid-link-modal ref="HTL" @ok="setLink" />
		</slot>
		<div style="display: none">
			<div ref="root">
				<n-card size="small" class="link-card" v-if="!isEdit">
					<div class="link-pop">
						<div class="link-href">
							{{ href }}
						</div>
						<n-button quaternary size="small" @click="isEdit=true">
							<i class="ri-edit-box-line"></i>
						</n-button>
						<n-button quaternary size="small" @click="unsetLink">
							<i class="ri-link-unlink"></i>
						</n-button>
					</div>
				</n-card>
				<n-card size="small" class="link-card" v-else>
					<n-form label-placement="left" label-width="auto">
						<n-form-item label="链接地址" :show-feedback="false">
							<n-input-group>
								<n-input v-model:value="href" />
							</n-input-group>
						</n-form-item>
						<n-form-item label="打开方式" :show-feedback="false">
							<n-radio-group v-model:value="target">
								<n-space>
									<n-radio value="_self"> 当前窗口</n-radio>
									<n-radio value="_blank"> 新窗口</n-radio>
								</n-space>
							</n-radio-group>
						</n-form-item>
					</n-form>
					<template #footer>
						<n-space justify="end">
							<n-button @click="onCancel" size="small"> 取消</n-button>
							<n-button type="info" @click="onOk" size="small"> 确定</n-button>
						</n-space>
					</template>
				</n-card>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.link-card {
		width: 400px;
		box-shadow: 0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03);
	}

	.link-pop {
		display: flex;
		align-items: center;
		gap: 5px;
		width: 100%;
	}

	.link-href {
		flex: 1;
		word-break: keep-all;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
