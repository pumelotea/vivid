<script setup lang="ts">
  import VividMenuItem from "../../components/VividMenuItem.vue";
  import { useEditorInstance } from "../utils/common";

  const editorInstance = useEditorInstance();

  function toggleFullscreen() {
    editorInstance.value.storage.fullscreen.value =
      !editorInstance.value.storage.fullscreen.value;
  }
</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
        :icon="
					editorInstance.storage.fullscreen.value
						? 'fullscreen-exit-line'
						: 'fullscreen-line'
				"
        title="全屏"
        :action="toggleFullscreen"
      />
    </slot>
  </div>
</template>

<style scoped></style>
