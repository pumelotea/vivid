<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import axios from 'axios'
import {inject} from "vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
  throw new Error('AI component must under VividEditor menu slot')
}

async function doSome(){
  // 获取编辑器的当前状态
  const state = editorInstance.value.state;

  // 获取选中的范围
  const selection = state.selection;

  // 判断是否有选中内容
  if (selection.empty) {
    console.log('没有选中任何内容');
    return;
  }
  // 获取选中的内容
  const selectedContent = selection.content().content;
  const text = selectedContent.textBetween(0, selectedContent.size)
  console.log(text)

  editorInstance.value.chain()
    .focus()
    .command(({ tr }) => {
      // manipulate the transaction
      tr.insertText(`[${text}]`)
      return true
    })
    .run()

  // const url = 'http://localhost:3040/v1/chat/completions';
  // const headers = {
  //   'Content-Type': 'application/json',
  // };
  // const data = {
  //   model: 'gpt-3.5-turbo',
  //   messages: [
  //     { role: 'system', content: 'You are a helpful assistant.' },
  //     { role: 'user', content: '你好' } // 确保 prompt.value 是有效的字符串
  //   ],
  // };
  // const response = await axios.post(url, data, { headers });
  // const result = response.data;
  // console.log(result)
  // if (result.choices && result.choices.length > 0) {
  //   console.log(result.choices[0].message.content)
  // } else {
  // }
}

</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <vivid-menu-item
          icon="sparkling-line"
          title="AI助手"
          :action="doSome"
          :is-active="() => {}"
      />
    </slot>
  </div>
</template>

<style scoped>

</style>
