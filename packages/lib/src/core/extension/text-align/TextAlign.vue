<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import TextAlign from '@tiptap/extension-text-align'
import { inject } from 'vue'
import { NSpace } from 'naive-ui'

const props = defineProps({
	options: {
		type: Object,
		required: false,
		default: () => {
			return {
				types: ['heading', 'paragraph'],
			}
		},
	},
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('TextAlign component must under VividEditor menu slot')
}
useExtension(TextAlign.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<n-space :size="2">
				<vivid-menu-item
					icon="align-left"
					title="左对齐"
					:action="
						() => editorInstance.chain().focus().setTextAlign('left').run()
					"
					:is-active="() => editorInstance.isActive('align-left')"
				/>
				<vivid-menu-item
					icon="align-center"
					title="居中"
					:action="
						() => editorInstance.chain().focus().setTextAlign('center').run()
					"
					:is-active="() => editorInstance.isActive('align-center')"
				/>
				<vivid-menu-item
					icon="align-right"
					title="右对齐"
					:action="
						() => editorInstance.chain().focus().setTextAlign('right').run()
					"
					:is-active="() => editorInstance.isActive('align-right')"
				/>
				<vivid-menu-item
					icon="align-justify"
					title="两端对齐"
					:action="
						() => editorInstance.chain().focus().setTextAlign('justify').run()
					"
					:is-active="() => editorInstance.isActive('align-justify')"
				/>
			</n-space>
		</slot>
	</div>
</template>

<style scoped></style>
