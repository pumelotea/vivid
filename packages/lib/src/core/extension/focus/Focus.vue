<script setup lang="ts">
  import Focus, { FocusOptions } from "@tiptap/extension-focus";
  import { PropType } from "vue";
  import { injectExtension } from "../utils/common";

  const props = defineProps({
    options: {
      type: Object as PropType<Partial<FocusOptions>>,
      required: false,
    },
  });

  injectExtension(Focus.configure(props.options));
</script>

<template>
</template>
<style scoped></style>
