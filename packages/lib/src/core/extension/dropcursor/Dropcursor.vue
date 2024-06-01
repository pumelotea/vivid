<script setup lang="ts">
  import Dropcursor, { DropcursorOptions } from "@tiptap/extension-dropcursor";
  import { PropType } from "vue";
  import { injectExtension } from "../utils/common";

  const props = defineProps({
    options: {
      type: Object as PropType<Partial<DropcursorOptions>>,
      required: false,
    },
  });

  injectExtension(Dropcursor.configure(props.options));
</script>

<template>
  <div style="display: none"></div>
</template>
<style scoped></style>
