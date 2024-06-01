<script setup lang="ts">
  import VividMenuItem from "../../components/VividMenuItem.vue";
  import { useEditorInstance } from "../utils/common";

  const editorInstance = useEditorInstance();
</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
        icon="format-clear"
        title="清除样式"
        :action="
					() =>
						editorInstance.chain().focus().clearNodes().unsetAllMarks().run()
				"
      />
    </slot>
  </div>
</template>

<style scoped></style>
