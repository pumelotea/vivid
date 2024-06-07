<script setup lang="ts">
  import VividMenuItem from "../../components/VividMenuItem.vue";
  import { ref, PropType } from "vue";
  import { useImage } from "./image";
  import VividImageModal from "./VividImageModal.vue";
  import { injectExtension, onEditorCreated, useEditorInstance } from "@lib/core/extension/utils/common";
  import { UploadFunction } from "@lib/core/extension/types";

  const props = defineProps({
    handleUpload: {
      type: Function as PropType<UploadFunction>,
      required: false,
    },
  });

  const editorInstance = useEditorInstance();
  injectExtension(useImage());

  const HTI = ref<any>(null);

  function handleOpenImage() {
    HTI.value.open();
  }


  onEditorCreated(() => {
    editorInstance.value.storage.image = {
      openUploader: handleOpenImage,
    };
  });


  function insertImage(url: string) {
    if (url) {
      editorInstance.value.chain().setImage({ src: url }).focus().run();
    }
  }

</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
        icon="image-line"
        title="插入图片"
        :action="handleOpenImage"
        :is-active="() => editorInstance.isActive('image')"
      />
      <vivid-image-modal
        :handle-upload="handleUpload"
        ref="HTI"
        @ok="insertImage"
      />
    </slot>
  </div>
</template>

<style scoped></style>
