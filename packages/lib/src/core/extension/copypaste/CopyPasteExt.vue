<script setup lang="ts">
  import { injectExtension, onEditorCreated, useEditorInstance } from "../utils/common";
import { useCopyPaste } from "@lib/core/extension/copypaste/copypaste";
import UploadPasteFile from "@lib/core/extension/copypaste/UploadPasteFile.vue";
  import { ref } from "vue";


const editor = useEditorInstance()
injectExtension(useCopyPaste())
const UPF = ref<any>()

onEditorCreated(()=>{
  editor.value.storage.copypaste = {
    handelOpenUpload: UPF.value.handelOpenUpload
  }
})
</script>

<template>
  <upload-paste-file ref="UPF"/>
</template>

<style scoped></style>
