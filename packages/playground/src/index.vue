<template>
  <div class="editor-wrap">
    <vivid-editor>
      <template #menu>
        <div class="menu-bar">
          <document-ext/>
          <paragraph-ext/>
          <hard-break-ext/>
          <indent-ext/>
          <history-ext/>
          <dropcursor-ext/>
          <gapcursor-ext/>
          <text-ext/>
          <placeholder-ext/>
          <character-count-ext/>
          <text-style-ext/>
          <focus-ext/>

          <undo-ext/>
          <redo-ext/>
          <format-clear-ext/>
          <divider-ext/>
          <ai-ext :options="{completions:AICompletions}"/>
          <bold-ext/>
          <italic-ext/>
          <strike-ext/>
          <underline-ext/>
          <color-ext/>
          <highlight-ext/>
          <divider-ext/>
          <heading-ext/>
          <divider-ext/>
          <text-align-ext/>
          <line-height-ext/>
          <divider-ext/>
          <subscript-ext/>
          <superscript-ext/>
          <divider-ext/>
          <image-ext/>
          <video-ext/>
          <link-ext/>
          <divider-ext/>
          <table-ext/>
          <math-ext/>
          <code-ext/>
          <code-block-ext/>
          <block-quote-ext/>
          <horizontal-rule-ext/>
          <bullet-list-ext/>
          <list-item-ext/>
          <ordered-list-ext/>
          <task-list-ext/>
          <divider-ext/>
          <fullscreen-ext/>
<!--          <hocuspocus-ext :options="opt"/>-->
        </div>
      </template>
      <template v-slot:bubble-menu="{nodeType}">
        <div class="bubble-menu-bar">
          <template v-if="nodeType === 'text'">
            <bold-ext/>
            <italic-ext/>
            <strike-ext/>
            <underline-ext/>
            <color-ext/>
            <highlight-ext/>
            <divider-ext/>
            <text-align-ext/>
          </template>
          <template v-if="nodeType === 'image'">
            <image-bubble-menu/>
          </template>
          <template v-if="nodeType === 'video'">
            <video-bubble-menu/>
          </template>
        </div>
      </template>
    </vivid-editor>
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
import {useThemeVars} from 'naive-ui'
import {nextTick} from 'vue'
import {VividEditor} from '@codecoderun/vivid'
import {
  BoldExt,
  BlockQuoteExt,
  CodeExt,
  BulletListExt,
  ColorExt,
  CharacterCountExt,
  CodeBlockExt,
  DocumentExt,
  DropcursorExt,
  GapcursorExt,
  HardBreakExt,
  HeadingExt,
  HighlightExt,
  HistoryExt,
  LinkExt,
  MathExt,
  ImageExt,
  ItalicExt,
  IndentExt,
  HorizontalRuleExt,
  ListItemExt,
  OrderedListExt,
  ParagraphExt,
  PlaceholderExt,
  StrikeExt,
  SubscriptExt,
  SuperscriptExt,
  TableExt,
  TextExt,
  TaskListExt,
  VideoExt,
  UnderlineExt,
  TextAlignExt,
  TextStyleExt,
  DividerExt,
  FormatClearExt,
  FullscreenExt,
  UndoExt,
  RedoExt,
  AiExt,
  FocusExt,
  LineHeightExt,
  HocuspocusExt,
  ImageBubbleMenu,
  VideoBubbleMenu,
} from '@codecoderun/vivid'
import OpenAI from "openai";

const vars = useThemeVars()


const emit = defineEmits(['update:user'])

let isFirst = true
const opt = {
  url: 'wss://ws.codecode.run',
  name: 'clvx2hl2s0077qf01xc449cqp',
  token: '123123',
  onAuthenticationFailed: () => {
    console.log('鉴权失败哎')
  },
  onSynced: () => {
    nextTick(() => {
      if (isFirst) {
        editorInstance.value.commands.focus('start')
        isFirst = false
      }
    })
  },
  onAwarenessUpdate: (data) => {
    emit('update:user', data)
  }
}

async function AICompletions(text) {
  const openai = new OpenAI({
    apiKey: 'sk-69357a9b1fb4426a9673e617931824f0',
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.deepseek.com',
  });
  const stream = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'user',
        content: ` I will give you text content, you will rewrite it and
translate the text into 'Chinese' language.
Keep the meaning the same. Do not alter the original structure
and formatting outlined in any way. Only give me the output and
nothing else.
Now, using the concepts above, translate the following text:

  ${text}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
    top_p: 0.9,
    stream: true,
  });
  return stream;
}

</script>
<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  padding: 5px 5px;
  gap: 2px;
  background-color: v-bind(vars.baseColor);
  box-sizing: border-box;
  border-bottom: 1px solid;
  border-color: v-bind(vars.borderColor);
}

.bubble-menu-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px 5px;
  background: v-bind(vars.popoverColor);
  border-radius: 3px;
  box-shadow: v-bind(vars.boxShadow2);
}
</style>
