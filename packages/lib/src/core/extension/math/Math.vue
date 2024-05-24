<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import {inject, ref, watch} from 'vue'
import VividMathModal from './VividMathModal.vue'
import { useMath } from './math.js'

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Math component must under VividEditor menu slot')
}
useExtension(useMath())

const HTM = ref(null)

function handleOpenMath() {
	const val = ''
	HTM.value.open(val)
}
// 提供共享的上传方法
watch(editorInstance,()=>{
  editorInstance.value.storage['hb-math'] = {
    openEditor: handleOpenMath
  }
})
function setMath(val) {
	editorInstance.value.chain().focus().setHbMath({ tex: val }).run()
}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="functions"
				title="数学公式"
				:action="handleOpenMath"
				:is-active="() => editorInstance.isActive('hb-math')"
			/>
			<vivid-math-modal ref="HTM" @ok="setMath" />
		</slot>
	</div>
</template>

<style scoped></style>
