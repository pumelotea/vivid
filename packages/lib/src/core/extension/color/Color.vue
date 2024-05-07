<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import VividColorPicker from '../../components/VividColorPicker.vue'
import Color from "@tiptap/extension-color";
import {inject,ref} from "vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Color component must under VividEditor menu slot')
}
useExtension(Color.configure(props.options))

const color = ref('#000000')

function setColor() {
  editorInstance.value.chain().focus().setColor(color.value).run()
}

function updateColor(e) {
  color.value = e
  setColor()
}

</script>

<template>
	<div v-if="editorInstance">
		<slot>
      <div class="color-box">
				<vivid-menu-item
					icon="font-color"
					title="字体颜色"
					:action="setColor"
					:is-active="() => editorInstance.isActive('font-color')"
				/>
				<vivid-color-picker @change="updateColor"/>
			</div>
		</slot>
	</div>
</template>

<style scoped>
.color-box{
	display: flex;
}
</style>
