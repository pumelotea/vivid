<script setup>
  import { computed, nextTick, ref } from "vue";
  import { useThemeVars, NUploadDragger, NUpload } from "naive-ui";
  // 启用中文
  const vars = useThemeVars();
  const props = defineProps({
    type: {
      type: String,
      default: "image", // image 或  video  或  audio
    },
  });

  const accept = computed(() => {
    switch (props.type) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "audio":
        return "audio/*";
    }
  });

  const fileValue = ref(null);
  const fileBlob = ref(null);
  const emit = defineEmits(["change"]);

  function handleSelect(event) {
    fileValue.value = URL.createObjectURL(event.file.file);
    fileBlob.value = event.file.file;
    nextTick(() => {
      emit("change", fileBlob.value);
    });
  }

  function handleDel() {
    fileValue.value = null;
    fileBlob.value = null;
    nextTick(() => {
      emit("change", fileBlob.value);
    });
  }

  function getFile() {
    return fileBlob.value;
  }

  defineExpose({ getFile });
</script>

<template>
  <div class="hb-su-wrap">
    <n-upload v-if="fileValue === null" :show-file-list="false" :accept="accept" @change="handleSelect">
      <n-upload-dragger>
        <div class="upload-drag-placeholder" v-if="props.type === 'image'">
          <i class="ri-image-add-line ri-2x"></i>
          <div>拖拽图片到此框内，或点击上传</div>
        </div>
        <div class="upload-drag-placeholder" v-if="props.type === 'video'">
          <i class="ri-video-upload-line ri-2x"></i>
          <div>拖拽视频到此框内，或点击上传</div>
        </div>
      </n-upload-dragger>
    </n-upload>
    <div v-if="fileValue" class="hb-su-preview">
      <div class="hb-su-close" @click="handleDel">
        <i class="ri-close-line" />
      </div>
      <img v-if="props.type === 'image'" style="width: 100%" :src="fileValue" />
      <video v-if="props.type === 'video'" style="width: 100%" :src="fileValue" />
    </div>
  </div>
</template>

<style scoped>
  .hb-su-wrap {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hb-su-preview {
    width: 400px;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }

  .hb-su-close {
    font-size: 12px;
    color: #fff;
    padding: 0 4px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .hb-su-close:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .upload-drag-placeholder{
    display: flex;
    flex-direction: column;
    gap:10px;

  }
</style>
