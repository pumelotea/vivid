# 快速开始

### 安装

```shell
pnpm install @codecoderun/vivid

# 依赖项
pnpm install remixicon
pnpm install katex
pnpm install naive-ui
```

### 使用

```vue

<template>
  <div class="editor-wrap">
    <vivid-editor v-model:value="data"></vivid-editor>
  </div>
</template>

<style scoped>
  .editor-wrap {
    height: 100vh;
    padding: 30px;
    box-sizing: border-box;
  }
</style>
<script setup>
  import {VividEditor} from '@codecoderun/vivid'
  import {ref} from 'vue'

  const data = ref('')
</script>
```

