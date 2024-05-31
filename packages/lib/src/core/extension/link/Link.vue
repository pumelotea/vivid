<script setup lang="ts">
import VividMenuItem from '../../components/VividMenuItem.vue'
import {inject, onMounted, Ref, ref} from 'vue'
import VividLinkModal from './VividLinkModal.vue'
import {useLink} from './link.ts'
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
} from 'naive-ui'
import {Editor} from "@tiptap/core";

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
})

const editorInstance: Ref<Editor> = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Link component must under VividEditor menu slot')
}

const isEdit = ref(false)
const HTL = ref(null)

function handleOpenLink() {
	if (editorInstance.value.isActive('link')) {
		editorInstance.value.chain().focus().unsetLink().run()
	} else {
		HTL.value.open()
	}
}

function toggleLink(text ,href, target) {
	editorInstance.value.chain().focus().toggleLink({ href, target }).run()
}

const root = ref()
const href = ref('')
const target = ref('_blank')
let lastTp = null
let node = null
let pos = null

function onShow(attrs, tp, linkNode, p) {
	lastTp = tp
	node = linkNode
	pos = p
	target.value = attrs.target
	href.value = attrs.href
}
function onHide(){
	isEdit.value = false
}

onMounted(() => {
	useExtension(useLink(root.value, onShow,onHide, props.options))
})

function onCancel() {
	lastTp && lastTp.destroy()
	isEdit.value = false
}

function unsetLink(){
	editorInstance.value.chain().focus().unsetLink().run()
	onCancel()
}

function onOk() {
	console.log(href.value)
	console.log(target.value)
	editorInstance.value.chain()
		.extendMarkRange('link')
		.setLink({href: href.value, target: target.value})
		.focus()
		.run()
	lastTp && lastTp.destroy()
	isEdit.value = false
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
			<vivid-link-modal ref="HTL" @ok="toggleLink"/>
		</slot>
		<div ref="root" style="display: none">
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
							<n-input v-model:value="href"/>
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
</template>

<style scoped>
.link-card {
	width: 400px;
	box-shadow: 0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03);
}
.link-pop{
	display: flex;
	align-items: center;
	gap: 5px;
	width: 100%;
}

.link-href{
	flex: 1;
	word-break: keep-all;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
