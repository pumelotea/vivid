<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import {inject, ref} from "vue";
import VividColorPicker from "../../components/VividColorPicker.vue";
import {useHighlight} from "./highlight.js";

const props = defineProps({
	options: {
		type: Object,
		required: false,
    default: ()=>{
      return { multicolor: true }
    }
	}
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Highlight component must under VividEditor menu slot')
}


useExtension(useHighlight(props.options))

const colorHighlight = ref('#fec300')

function setHighlightColor() {
	editorInstance.value.chain().focus().toggleHighlight({color: colorHighlight.value}).run()
}

function updateHeightColor(e) {
	colorHighlight.value = e
	editorInstance.value.chain().focus().setHighlight({color: colorHighlight.value}).run()
}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<div class="color-box">
				<vivid-menu-item
					icon="mark-pen-line"
					title="高亮"
					:action="setHighlightColor"
					:is-active="() => editorInstance.isActive('highlight')"
				/>
				<vivid-color-picker
					:default-color="colorHighlight"
					@change="updateHeightColor"
				/>
			</div>
		</slot>
	</div>
</template>

<style scoped>
.color-box{
	display: flex;
}
</style>
