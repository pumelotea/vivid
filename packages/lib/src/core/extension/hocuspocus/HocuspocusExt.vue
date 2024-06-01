<script setup lang="ts">
  import { PropType } from "vue";
  import { useHocuspocus, getRandomColor } from "./hocuspocus";
  import { HocuspocusProviderConfiguration } from "@hocuspocus/provider";
  import { injectExtension } from "@lib/core/extension/utils/common";

  const props = defineProps({
    options: {
      type: Object as PropType<HocuspocusProviderConfiguration>,
      required: true,
    },
    user: {
      type: Object as PropType<Record<string, any>>,
      required: false,
      default: () => {
        return {
          // avatar: '',
          // name: '',
          color: getRandomColor(),
        };
      },
    },
  });

  injectExtension("history");
  useHocuspocus(props.options, props.user).map((ext) => {
    injectExtension(ext);
  });
</script>

<template>
  <div style="display: none"></div>
</template>
<style scoped></style>
