<script setup lang="ts">
  import { NModal, NSpin, NUpload, UploadCustomRequestOptions, UploadFileInfo, useMessage } from "naive-ui";
  import { ref, watch } from "vue";
  import { useEditorInstance } from "@lib/core/extension/utils/common";
  import { useWebWorkerFn } from "@vueuse/core";

  const message = useMessage();
  const show = ref(false);
  const uploadRef = ref<any>();
  const list = ref<UploadFileInfo[]>([]);
  let uploaded: string[] = [];
  const loading = ref(true);

  const editor = useEditorInstance();

  const createURL = useWebWorkerFn((file:File)=>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  })
  function handelOpenUpload(files: File[]) {
    show.value = true;
    loading.value = true;
    uploaded = [];

    const p = new Promise(resolve => {
      setTimeout(async () => {
        const tmp : any[] = []
        for (let file of files) {
          const tUrl = await createURL.workerFn(file)
          tmp.push({
            id: file.name,
            status: "pending",
            name: file.name,
            file: file,
            thumbnailUrl: tUrl,
          })
        }
        list.value = tmp
        loading.value = false
        resolve(null)
      }, 1000);
    })

    p.then(()=>{
      setTimeout(()=>{
        uploadRef.value?.submit();
      },100)
    })
  }

  defineExpose({
    handelOpenUpload,
  });

  watch(show, () => {
    if (!show.value) {
      list.value = [];
    }
  });

  async function handleUpload(data: UploadCustomRequestOptions) {
    const ext = editor.value.extensionManager.extensions.find(e => e.name === "image");
    if (!ext){
      return
    }
    const url = await ext.options.handleUpload(data.file.file, (n: number) => {
      data.onProgress({ percent: n });
    });
    uploaded.push(url);
    data.onFinish();
  }

  function handleFinish() {
    if (uploaded.length === list.value.length) {
      uploaded.forEach(url => {
        editor.value.commands.insertHtml(`<p><img alt="" src="${url}"/></p>`);
      });
      show.value = false;
      message.success(`上传 ${uploaded.length}张图片 成功`);
    }
  }

</script>

<template>
  <n-modal style="width: 600px;" preset="card" title="上传" v-model:show="show" :mask-closable="false">
    <div class="loading-box" v-if="loading">
      <n-spin></n-spin>
    </div>
    <n-upload
      v-if="!loading"
      style="min-height: 300px"
      ref="uploadRef"
      :default-upload="false"
      :default-file-list="list"
      list-type="image"
      :show-remove-button="false"
      :show-cancel-button="false"
      :show-download-button="false"
      :custom-request="handleUpload"
      @finish="handleFinish"
    ></n-upload>
  </n-modal>
</template>

<style scoped>
.loading-box{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
