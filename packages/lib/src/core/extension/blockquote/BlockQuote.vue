<script setup lang="ts">
import VividMenuItem from '../../components/VividMenuItem.vue'
import BlockQuote, {BlockquoteOptions} from '@tiptap/extension-blockquote'
import {useEditorInstance, injectExtension} from "../utils/common";
import {PropType} from "vue";

const props = defineProps({
  options: {
    type: Object as PropType<Partial<BlockquoteOptions>>,
    required: false,
  },
})

const editorInstance = useEditorInstance()
injectExtension(BlockQuote.configure(props.options))

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

<style scoped></style>
