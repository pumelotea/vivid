<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
  import { onBeforeUnmount, ref ,h } from "vue";
  import { NDrawer, NDrawerContent, NTree, NIcon, TreeOption } from "naive-ui";
  import {
    onEditorCreated,
    useEditorInstance,
  } from "@lib/core/extension/utils/common";
  import { Level } from "@tiptap/extension-heading";

	const editorInstance = useEditorInstance();

	const HTM = ref<any>(null);
  const show = ref(false)

  type HeadingItem = {
    label: string; //标题
    level: Level; //标题大小（1-6）
    key: string
    children: HeadingItem[];
    dom: HTMLElement
  };
  const getHeadingTree = (items: HeadingItem[]) => {
    let result: HeadingItem[] = [];
    let i = 0;
    while (i < items.length) {
      const item: HeadingItem = { ...items[i]};
      const children = []
      i++;
      while (i < items.length && items[i].level > item.level) {
        children.push(items[i]);
        i++;
      }
      if (children.length > 0) {
        const nextChildren = getHeadingTree(children);
        if(nextChildren.length > 0) {
          item.children = nextChildren
        }
      }
      result.push(item);
    }
    return result
  }

  const target = ref<any>(null)
  const treeData = ref([])
	function handleOpen() {
    if (show.value){
      show.value = false
      return
    }
    show.value = true
	}

  function renderPrefix(item: any){
    return h(NIcon, { class: `ri-h-${item.option.level}` })
  }

  function update(){
    let dom = editorInstance.value.options.element
    if (dom.classList.contains('editor-body-page')){
      dom = dom.parentElement
    }

    target.value = dom
    const list = [...dom.querySelectorAll('h1,h2,h3,h4')]
    const items: HeadingItem[] = []
    list.forEach((e,i)=>{
      items.push({
        label: e.innerText,//标题
        level: parseInt(e.nodeName.slice(1), 10), //标题大小（1-6）
        key: i,
        dom: e,
        children: []
      })
    })
    treeData.value = getHeadingTree(items)
  }

  onEditorCreated(()=>{
    editorInstance.value.on('update', update)
  })

  onBeforeUnmount(()=>{
    editorInstance.value.off('update', update)
  })

  const nodeProps = ({ option } : { option: TreeOption & HeadingItem }) => {
    return {
      onClick () {
        option.dom.scrollIntoView()
      }
    }
  }
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="node-tree"
				title="文档大纲"
				:action="handleOpen"
        :is-active="()=>show"
			/>
		</slot>
    <n-drawer :show-mask="false" :closable="false" :close-on-esc="false"  :width="300" :show="show" :trap-focus="false" :block-scroll="false" :auto-focus="false">
      <n-drawer-content>
        <n-tree
          style="height: 100%"
          :data="treeData"
          :default-expand-all="true"
          :render-prefix="renderPrefix"
          :node-props="nodeProps"
        >
          <template #empty>
            <div class="empty-outline">
              <i class="ri-2x ri-draft-line"></i>
              <div>暂无大纲</div>
            </div>
          </template>
        </n-tree>
      </n-drawer-content>
    </n-drawer>
	</div>
</template>

<style scoped>
  .empty-outline{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
