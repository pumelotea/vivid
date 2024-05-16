<script setup >
import VividMenuItem from "../../components/VividMenuItem.vue"
import Italic from "@tiptap/extension-italic";
import {inject} from "vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
  throw new Error('Italic component must under VividEditor menu slot')
}
useExtension(Italic.configure(props.options))
</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
          icon="italic"
          title="斜体"
          :action="() => editorInstance.chain().focus().toggleItalic().run()"
          :is-active="() => editorInstance.isActive('italic')"
      />
    </slot>
  </div>
</template>

<style scoped>

</style>
