<script setup>
import {
  useBold,
  BoldExt,
  useBlockquote,
  BlockQuoteExt,
  useCode,
  CodeExt,
  useBulletList,
  BulletListExt,
  useColor,
  ColorExt,
  useCharacterCount,
  CharacterCountExt,
  useCodeBlock,
  CodeBlockExt,
  useDocument,
  DocumentExt,
  useDropcursor,
  DropcursorExt,
  useGapcursor,
  GapcursorExt,
  useHardBreak,
  HardBreakExt,
  useHeading,
  HeadingExt,
  useHighlight,
  HighlightExt,
  useHistory,
  HistoryExt,
  useHocuspocus,
  useLink,
  LinkExt,
  useMath,
  MathExt,
  useImage,
  ImageExt,
  useItalic,
  ItalicExt,
  useIndent,
  IndentExt,
  useHorizontalRule,
  HorizontalRuleExt,
  useListItem,
  ListItemExt,
  useOrderedList,
  OrderedListExt,
  useParagraph,
  ParagraphExt,
  usePlaceholder,
  PlaceholderExt,
  useStrike,
  StrikeExt,
  useSubscript,
  SubscriptExt,
  useSuperscript,
  SuperscriptExt,
  useTable,
  TableExt,
  useText,
  TextExt,
  useTaskList,
  TaskListExt,
  useVideo,
  VideoExt,
  useUnderline,
  UnderlineExt,
  useTextAlign,
  TextAlignExt,
  useTextStyle,
  TextStyleExt,
  getRandomColor,
  DividerExt,
  FormatClearExt,
  FullscreenExt,
  UndoExt,
  RedoExt,
  AiExt,
    FocusExt,
  HocuspocusExt,
} from '../../core/extension'
import {useThemeVars} from 'naive-ui'
import {inject, nextTick, ref} from "vue";
import OpenAI from "openai";

const editorInstance = inject('editorInstance')
const emit = defineEmits(['update:user'])

const vars = useThemeVars()
let isFirst = true
const opt = {
  url                   : 'wss://ws.codecode.run',
  name                  : 'clvx2hl2s0077qf01xc449cqp',
  token                 : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNscDJrZmE4dTAwMDBweDB4aXlpam1rYmkiLCJ1c2VybmFtZSI6InJvb3QiLCJwYXNzd29yZCI6IiQyYSQxMCRpZHVLLlhUVE5jTmlzdEtjRXVPWXZPRUtWbTNQazdFSW8vbXNoQnNSVTh3V0d1cHNnTFcwVyIsInNhbHQiOm51bGwsIm5hbWUiOiIiLCJuaWNrbmFtZSI6IuacseWzsCIsImF2YXRhciI6Ii9hdmF0YXIvS054QzBqbHQ2TGk1UDhZWjB6dHMucG5nIiwiaXNFbmFibGUiOnRydWUsInBob25lTnVtYmVyIjoiMTM0NTYyNzUyNTIiLCJjcmVhdGVkQXQiOiIyMDIzLTExLTE3VDExOjU3OjIyLjIwNFoiLCJjcmVhdGVkQnkiOm51bGwsInVwZGF0ZWRBdCI6IjIwMjMtMTItMDZUMTM6MTk6NTAuNjI1WiIsInVwZGF0ZWRCeSI6ImNscDJrZmE4dTAwMDBweDB4aXlpam1rYmkiLCJkZWxldGVkIjpudWxsLCJkZWxldGVkQnkiOm51bGwsImlhdCI6MTcxNTA0MDM3OSwiZXhwIjoxNzE1MjEzMTc5fQ.lG6wpWdynO1ui0cfv2wtV_DZkqC_gPafrXoNxsImUyI',
  onAuthenticationFailed: () => {
    console.log('鉴权失败哎')
  },
  onSynced: () => {
    nextTick(() => {
      if (isFirst) {
        // editorInstance.value.commands.focus('start')
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
    apiKey: 'T9erAeInUDfkSVJixprmUj9Nn8JSBT9Z',
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.deepinfra.com/v1/openai',
  });
  const stream = await openai.chat.completions.create({
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
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
<template>
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
<!--    <hocuspocus-ext :options="opt"/>-->
  </div>
</template>

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  padding: 5px 5px;
  gap: 2px;
  background-color: v-bind(vars.baseColor);
}
</style>
