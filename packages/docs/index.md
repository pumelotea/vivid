---
layout: home

hero:
  name: 开放平台
  text: in嘉善
  tagline: H5应用接入
  image:
    src: /logo.svg
    alt: VitePress
  actions:
    - theme: brand
      text: 快速开始
      link: /quick/index.html
    - theme: alt
      text: 对接流程
      link: /flow/index.html
---

<script setup>
import {ref, watch} from "vue";
import {useMutationObserver} from "@vueuse/core";
import {isDarkTheme,theme, isDark} from "@codecoderun/vivid";
const text = ref('');
import { zhCN, dateZhCN ,NConfigProvider,NCard,NInput} from "naive-ui";
const dom = document.querySelector('html');

function updateTheme(){
  isDarkTheme.value = dom.classList.contains('dark')
}

const observer = useMutationObserver(dom, (mutations) => {
    updateTheme()
}, {
  attributes: true,
});

updateTheme()

</script>


<ClientOnly>
<n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN" style="height: 100%">
<div style="display: flex;justify-content: center;flex-direction: column;align-items: center">
    <div style="padding: 40px;max-width:1280px;height: 600px">
        <vivid-editor v-model="text"/>
    </div>
    <div title="输出内容" style="padding: 40px;max-width:1280px;height: 600px;width: 100%"> 
        <n-input
          v-model:value="text"
          type="textarea"
        />
    </div>
</div>
 </n-config-provider>
</ClientOnly>
