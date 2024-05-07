<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import Underline from "@tiptap/extension-underline";
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
  throw new Error('Underline component must under VividEditor menu slot')
}
useExtension(Underline.configure(props.options))
</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
          icon="underline"
          title="下划线"
          :action="() => editorInstance.chain().focus().toggleUnderline().run()"
          :is-active="() => editorInstance.isActive('underline')"
      />
    </slot>
  </div>
</template>

<style scoped>

</style>
