<script setup>
import VividMenuItem from "../../components/VividMenuItem.vue"
import BlockQuote from "@tiptap/extension-blockquote";
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
  throw new Error('BlockQuote component must under VividEditor menu slot')
}
useExtension(BlockQuote.configure(props.options))
</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
          icon="double-quotes-l"
          title="引用"
          :action="() => editorInstance.chain().focus().toggleBlockquote().run()"
          :is-active="() => editorInstance.isActive('blockquote')"
      />
    </slot>
  </div>
</template>

<style scoped>

</style>
