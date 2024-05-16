<template>
  <NodeViewWrapper as="article" class="ai-modal">
      <div class="ai-help">
        <div class="ai-mask" @click="handleMaskClick"></div>
        <div class="ai-modal-wrapper">
          <div class="ai-modal-main-container">
            <div class="ai_modal_main_inner_container">
              <div
                  class="ai_modal_writing_tips_wrapper"
                  v-if="status === 'loading'"
              >
                <div
                    class="ai_modal_writing_tips_loading_wrapper"
                    style="width: 24px"
                >
                  <div
                      class="ai_modal_basic_icon"
                      style="width: 24px; height: 24px"
                  >
                    <img
                        src="https://docs.gtimg.com/docs-design-resources/icon/desktop/png@3x/ai-assistant_fill_motion_loop_24@3x-00b564ad53.png"
                        width="24"
                        height="24"
                        draggable="false"
                    />
                  </div>
                </div>
                <div class="ai_modal_writing_tips_header">智能助手创作中...</div>
                <div class="ai_modal_writing_tips_button_wrapper">
                  <n-button size="small" secondary @click="handleStop"
                  >停止
                  </n-button
                  >
                </div>
              </div>
              <div class="ai_modal_input_area_wrapper" v-if="status === 'idle'">
                <div class="ai_modal_input_area_left_icon">
                  <div
                      class="ai_modal_basic_icon"
                      style="width: 24px; height: 24px"
                  >
                    <img
                        src="https://docs.gtimg.com/docs-design-resources/icon/desktop/png@3x/ai-assistant_fill_motion_once_24@3x-23803ec719.png"
                        width="24"
                        height="24"
                        draggable="false"
                    />
                  </div>
                </div>
                <div
                    class="ai_modal_input_area"
                    contenteditable="true"
                    ref="inputRef"
                    spellcheck="false"
                    placeholder="让智能助手帮我..."
                />
                <div class="ai_modal_input_area_right_icon">
                  <div
                      class="dui-trigger dui-tooltip dui-tooltip-wrapper"
                      data-dui-1-3-5="dui-trigger dui-tooltip dui-tooltip-wrapper"
                  >
                    <div>
                      <div
                          class="ai_modal_input_submit_button ai_modal_input_submit_button_active"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="status === 'generating' || status === 'completed'">
                <div class="ai_modal_edit_board_header">
                  <div>生成结果</div>
                  <div>
                    <Icon
                        @click="handleDelete"
                        style="width: 22px; height: 22px"
                        icon="mdi:close"
                    />
                  </div>
                </div>
                <div class="ai_modal_message_board">
                  {{ result }}
                </div>
                <div class="ai_modal_edit_board_footer">
                  <div class="ai_model_edit_board_buttons">
                    <div class="ai_model_edit_board_left_buttons">
                      <n-space>
                        <n-button type="info" @click="handleReplace"
                        >替换原文
                        </n-button
                        >
                        <n-button secondary @click="insetBottom"
                        >插入到下方
                        </n-button
                        >
                        <n-button-group>
                          <n-button @click="copy('ss')">
                            <n-icon size="18">
                              <Icon icon="mdi:content-copy"/>
                            </n-icon>
                          </n-button>
                          <n-button>
                            <n-icon size="18">
                              <Icon icon="mdi:refresh"/>
                            </n-icon>
                          </n-button>
                          <n-button @click="handleDelete">
                            <n-icon size="18">
                              <Icon icon="mdi:delete"/>
                            </n-icon>
                          </n-button>
                        </n-button-group>
                      </n-space>
                    </div>
                    <div
                        class="ai_model_edit_board_right_button ai_model_edit_board_right_button_with_func"
                    >
                      <div
                          class="ai_modal_basic_icon"
                          style="width: 24px; height: 24px"
                      >
                        <img
                            src="https://docs.gtimg.com/docs-design-resources/icon/desktop/svg/ai-assistant_fill_24-93d29aa4ff.svg"
                            width="24"
                            height="24"
                            draggable="false"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ai_modal_popup_menu" v-if="status === 'idle'">
            <div
                id="ai-modal-lazy-menu-container"
                class="ai_modal_basic_lazy_list_container"
                style="max-height: 297.2px"
            >
              <n-dropdown
                  placement="bottom-start"
                  trigger="manual"
                  :options="options"
                  :render-icon="renderDropdownIcon"
                  :show="showDropdown"
                  @select="handleSelect"
              >
                <div></div>
              </n-dropdown>
            </div>
          </div>
        </div>
      </div>
  </NodeViewWrapper>
</template>

<script setup>
import {computed, ref, onMounted, h} from 'vue';
import {nodeViewProps, NodeViewWrapper} from '@tiptap/vue-3';
import {
  NButton,
  NDropdown,
  NSpace,
  NButtonGroup,
  NIcon,
  useMessage,
  useDialog,
  useThemeVars,
} from 'naive-ui';
import {Icon} from '@iconify/vue';
const vars = useThemeVars()
const props = defineProps({
  ...nodeViewProps,
});
const status = ref('idle');
const result = ref('');
const messageList = ref([]);
const showDropdown = ref(true);
const message = useMessage();
const dialog = useDialog();
const inputRef = ref();
const options = [
  {
    label: 'AI续写',
    icon: 'mdi:magic',
    key: 'jay gatsby',
  },
  {
    label: 'AI润色',
    icon: 'mdi:magic-staff',
    key: 'runse',
    children: [
      {
        label: '更加详细',
        icon: 'mdi:magic-staff',

        key: 'xiangxi',
      },
      {
        icon: 'mdi:magic-staff',
        label: '更加精简',
        key: 'jingjian',
      },
      {
        icon: 'mdi:magic-staff',
        label: '更加正式',
        key: 'zhengshi',
      },
      {
        label: '更加连贯',
        icon: 'mdi:magic-staff',
        key: 'lianguan',
      },
      {
        icon: 'mdi:magic-staff',
        label: '更加生动',
        key: 'shengdong',
      },
    ],
  },
  {
    label: 'AI校阅',
    key: 'jiaoyue',
    icon: 'mdi:file-document-box-search-outline',
  },
  {
    label: 'AI翻译',
    icon: 'mdi:translate',
    key: 'nick carraway',
    children: [
      {
        label: '英语',
        icon: 'mdi:translate',
        key: 'jordan baker',
      },
      {
        label: '中文',
        icon: 'mdi:translate',
        key: 'jordan baker',
      },
    ],
  },
];
onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
});

function renderDropdownIcon(item) {
  return h(
      NIcon,
      {size: 18},
      {default: () => h(Icon, {icon: item.icon})}
  );
}

function handleMaskClick() {
  if (result.value) {
    dialog.warning({
      title: '是否退出 AI 助手',
      content: '确认退出后，当前生成的内容将会不会保留',
      positiveText: '确认退出',
      negativeText: '取消',
      onPositiveClick: () => {
        props.deleteNode();
      },
    });
  } else {
    props.deleteNode();
  }
}

async function handleSelect(key) {
  status.value = 'loading';
  const selectionText = props.node.attrs.selectionText;
  const stream = await props.extension.options.completions(selectionText);
  status.value = 'generating';
  for await (const chunk of stream) {
    messageList.value.push(chunk.choices[0]?.delta?.content || '');
    result.value += chunk.choices[0]?.delta?.content || '';
  }
  status.value = 'completed';
}

function handleStop() {
  status.value = 'idle';
}

function handleReplace() {
  props.deleteNode();
  const range = {
    from: Number(props.node.attrs.selectionFrom),
    to: Number(props.node.attrs.selectionTo),
  };
  props.editor
      .chain()
      .focus()
      .setTextSelection(range)
      .deleteSelection()
      .insertContent(result.value)
      .run();
}

function insetBottom() {
  // 将text插入光标下方
  props.editor.commands.insertContent(result.value);
}

function copy(text) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('复制成功');
  });
}

function handleDelete() {
  props.deleteNode();
}
</script>
<style scoped>
.ai-help img{
  background: transparent;
}

.ai-modal {
  position: relative;
}

.ai-mask {
  z-index: 1000;
  position: fixed;
  height: 100%;
  inset: 0;
}

.ai-modal-wrapper {
  z-index: 1001;
  position: fixed;
  min-height: 44px;
  min-width: 280px;
}

.ai-modal-main-container {
  --bgcolor: v-bind(vars.cardColor);
  width: 100%;
  min-height: 24px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(0deg, var(--bgcolor), var(--bgcolor)) content-box,
  linear-gradient(81.99deg, #e215ed 0%, #0e80b9 73.05%, #d192ff 100%) border-box;
  box-shadow: 0 5px 12px 4px rgba(0, 0, 0, 0.08);
}

.ai_modal_main_inner_container {
  padding: 8px 16px;
}

.ai_modal_input_area_wrapper {
  width: 100%;
  overflow: hidden;
  padding: 2px 0;
  display: flex;
  flex-direction: row;
}

.ai_modal_input_area {
  flex-grow: 1;
  line-height: 20px;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 2px 8px;
  caret-color: #1e6fff;
  max-height: 200px;
  box-sizing: border-box;
  overflow-y: auto;
  outline: none;
}

.ai_modal_input_area:empty:before {
  content: attr(placeholder);
  opacity: 0.8;
  pointer-events: none;
}

.ai_modal_basic_icon {
  display: flex;
  align-items: center;
  flex-direction: row;
  border-radius: 2px;
}

.ai_modal_input_area_left_icon {
  width: 24px;
}

.ai_modal_input_area_right_icon {
  min-width: 24px;
  display: flex;
  flex-direction: column-reverse;
}

[data-dui-1-3-5~='dui-tooltip-wrapper'] {
  display: inline-block;
  position: relative;
}

.ai_modal_input_submit_button_active {
  cursor: pointer;
  background-image: url('data:image/svg+xml,%3Csvg width%3D%2224%22 height%3D%2224%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle cx%3D%2212%22 cy%3D%2212%22 r%3D%229%22 fill%3D%22url(%23paint0_linear_5_2540)%22%2F%3E%3Cpath d%3D%22M11.8535 8.11091L16.0962 12.3536L11.8535 16.5962%22 stroke%3D%22white%22 stroke-width%3D%221.25%22%2F%3E%3Cline x1%3D%2215.3891%22 y1%3D%2212.2714%22 x2%3D%226.90382%22 y2%3D%2212.2714%22 stroke%3D%22white%22 stroke-width%3D%221.25%22%2F%3E%3Cdefs%3E%3ClinearGradient id%3D%22paint0_linear_5_2540%22 x1%3D%2221%22 y1%3D%223%22 x2%3D%223%22 y2%3D%2221%22 gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop stop-color%3D%22%23DB94FF%22%2F%3E%3Cstop offset%3D%220.456607%22 stop-color%3D%22%235179FF%22%2F%3E%3Cstop offset%3D%221%22 stop-color%3D%22%235AB0FF%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E');
}

.ai_modal_input_submit_button_active:hover {
  background-image: url('data:image/svg+xml,%3Csvg width%3D%2224%22 height%3D%2224%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle cx%3D%2212%22 cy%3D%2212%22 r%3D%229%22 fill%3D%22url(%23paint0_linear_1387_127239)%22%2F%3E%3Cpath d%3D%22M11.8536 8.11091L16.0962 12.3536L11.8536 16.5962%22 stroke%3D%22white%22 stroke-width%3D%221.25%22%2F%3E%3Cline x1%3D%2215.3891%22 y1%3D%2212.2714%22 x2%3D%226.90382%22 y2%3D%2212.2714%22 stroke%3D%22white%22 stroke-width%3D%221.25%22%2F%3E%3Cdefs%3E%3ClinearGradient id%3D%22paint0_linear_1387_127239%22 x1%3D%2221%22 y1%3D%223%22 x2%3D%223%22 y2%3D%2221%22 gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop stop-color%3D%22%23C182E0%22%2F%3E%3Cstop offset%3D%220.456607%22 stop-color%3D%22%23476BE0%22%2F%3E%3Cstop offset%3D%221%22 stop-color%3D%22%234F9BE0%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E');
}

.ai_modal_input_submit_button {
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
}

.ai_modal_popup_menu {
  position: absolute;
  top: 100%;
  margin-top: 8px;
  border-radius: 4px;
  width: 232px;
}

.ai_modal_writing_tips_wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  user-select: none;
}

.ai_modal_writing_tips_loading_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ai_modal_writing_tips_header {
  flex-grow: 1;
  color: var(--text-ultrastrong);
  font-size: 14px;
  padding: 4px 8px;
  line-height: 20px;
}

.ai_modal_writing_tips_button_wrapper {
  display: flex;
  flex-direction: row;
}

.ai_modal_basic_icon {
  display: flex;
  align-items: center;
  flex-direction: row;
  border-radius: 2px;
}

.ai_modal_message_board {
  position: relative;
  overflow-y: auto;
  max-height: 300px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
  text-size-adjust: none;
  text-rendering: auto;
}

.ai_modal_edit_board_footer {
  padding: 16px 0 8px 0;
}

.ai_model_edit_board_buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30px;
  width: 100%;
}

.ai_model_edit_board_left_buttons {
  display: flex;
  flex-direction: row;
}

.ai_model_edit_board_right_button {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ai_modal_edit_board_header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 4px 0;
  font-size: 12px;
  line-height: 24px;
  height: 24px;
  color: #999;
  box-sizing: content-box;
}
</style>
