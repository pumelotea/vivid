<script setup lang="ts">
  import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
  import { computed, nextTick, onMounted } from "vue";
  import { NPopover, useThemeVars } from "naive-ui";
  import { CellSelection, updateColumnsOnResize } from "prosemirror-tables";
  import TableBubbleMenu from "./TableBubbleMenu.vue";

  const vars = useThemeVars();
  const props = defineProps(nodeViewProps);

  const isFocus = computed(()=>{
    const pos = props.getPos()
    const size = props.node.nodeSize
    const from = props.editor.state.selection.from
    return from >=pos && from <= pos+size
  })


  const showToolPop = computed(() => {
    const selection = props.editor.state.selection;
    const isCell = selection instanceof CellSelection;
    const isTable = selection.node?.type.name === "table" || isCell; // 选中表格或者单元格
    if (isTable && isFocus.value) {
      return true;
    }
    return false;
  });

  const minWidth = computed(()=>{
    return props.node.attrs
  })

  onMounted(()=>{
    nextTick(()=>{
      const dom = props.editor.view.nodeDOM(props.getPos())
      const tableDOM = dom.querySelector('table')
      const colgroup = tableDOM.querySelector('colgroup')
      updateColumnsOnResize(props.node, colgroup, tableDOM, 30)
    })
  })

</script>

<template>
  <node-view-wrapper
    class="vivid-table"
  >
    <div
      class="table-box"
    >
      <div class="table-bubble-container">
        <n-popover
          :show-arrow="false"
          trigger="manual"
          style="padding: 0;border-radius: 10px;margin-bottom: 10px;margin-left: 10px"
          :show="showToolPop"
        >
          <template #trigger>
            <div></div>
          </template>
          <table-bubble-menu />
        </n-popover>
      </div>
      <table>
        <colgroup></colgroup>
        <node-view-content as="tbody"></node-view-content>
      </table>
    </div>
  </node-view-wrapper>
</template>

<style lang="scss">
  .vivid-table {
    max-width: 100%;
    --selected-cell-color1: #a6cbff;
    --selected-cell-color: #dbe8fa;

    .grip-column {
      position: absolute;
      left: -1px;
      right: -1px;
      height: 10px;
      top: -10px;
      border: 1px solid #c4c4c4;
      box-sizing: border-box;
      transition: all 0.2s;

      &.selected {
        background-color: var(--selected-cell-color1) !important;
      }

      &:hover {
        background-color: var(--selected-cell-color1) !important;
      }

      &.first {
      }

      &.last {
        border-top-right-radius: 2px;
      }
    }

    .grip-row {
      position: absolute;
      left: -10px;
      width: 10px;
      top: -1px;
      bottom: -1px;
      border: 1px solid #c4c4c4;
      box-sizing: border-box;
      transition: all 0.2s;

      &.selected {
        background-color: var(--selected-cell-color1) !important;
      }

      &:hover {
        background-color: var(--selected-cell-color1) !important;
      }

      &.first {
      }

      &.last {
        border-bottom-left-radius: 2px;
      }
    }

    .grip-row-col{
      position: absolute;
      left: -10px;
      width: 10px;
      top: -10px;
      height: 10px;
      border: 1px solid #c4c4c4;
      box-sizing: border-box;
      transition: all 0.2s;
      border-top-left-radius: 2px;

      &.selected {
        background-color: var(--selected-cell-color1) !important;
      }

      &:hover {
        background-color: var(--selected-cell-color1) !important;
      }
    }


    .table-box {
      position: relative;
      max-width: 100%;
      width: fit-content;
      user-select: auto;
    }

    table {
      padding-top: 10px;
      padding-left: 10px;
    }

    .selectedCell {
      background-color: var(--selected-cell-color) !important;
    }
  }


  .table-bubble-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }

  .vivid-table th, td {
    position: relative;
  }


</style>
