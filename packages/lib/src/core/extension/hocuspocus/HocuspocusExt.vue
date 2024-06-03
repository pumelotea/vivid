<script setup lang="ts">
  import { PropType } from "vue";
  import { useHocuspocus, getRandomColor } from "./hocuspocus";
  import { HocuspocusProviderConfiguration } from "@hocuspocus/provider";
	import { injectExtension, uninjectExtension } from "@lib/core/extension/utils/common";

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

	uninjectExtension("history");
  useHocuspocus(props.options, props.user).map((ext) => {
    injectExtension(ext);
  });
</script>

<template>
</template>
<style scoped></style>
