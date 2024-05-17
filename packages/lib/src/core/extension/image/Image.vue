<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject, ref } from 'vue'
import { useImage } from './image.js'
import VividImageModal from './VividImageModal.vue'

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
	handleUpload: {
		type: Function,
		required: false,
		default: null,
	},
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Image component must under VividEditor menu slot')
}
useExtension(useImage())

const HTI = ref(null)

function handleOpenImage() {
	HTI.value.open()
	// editorInstance.value.chain().focus().setImage({src: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/gold.981a5510.svg'}).run()
}

function insertImage(url) {
	if (url) {
		editorInstance.value.chain().focus().setImage({ src: url }).run()
	}
}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="image-line"
				title="插入图片"
				:action="handleOpenImage"
				:is-active="() => editorInstance.isActive('image')"
			/>
			<vivid-image-modal
				:handle-upload="handleUpload"
				ref="HTI"
				@ok="insertImage"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
