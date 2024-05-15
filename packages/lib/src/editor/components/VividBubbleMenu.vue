<script setup>
import {useThemeVars} from 'naive-ui'
const vars = useThemeVars()
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
} from '../../core/extension'
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {CellSelection} from "prosemirror-tables";
import {TextSelection} from "@tiptap/pm/state";
import ImageBubbleMenu from "../../core/extension/image/ImageBubbleMenu.vue";
import VideoBubbleMenu from "../../core/extension/video/VideoBubbleMenu.vue";
import OpenAI from "openai";

const editorInstance = inject('editorInstance')

const nodeType = computed(() => {
  const selection = editorInstance.value.state.selection
  const isImage = selection.node?.type.name === 'image';
  const isVideo = selection.node?.type.name === 'video';
  const isMagic = selection.node?.type.name === 'magic';
  const isCell = selection instanceof CellSelection;
  const isTable = selection.node?.type.name === 'table' || isCell; // 选中表格或者单元格
  const isText = selection instanceof TextSelection;
  if (isImage) return 'image';
  if (isVideo) return 'video';
  if (isTable) return 'table';
  if (isText) return 'text';
  if (isMagic) return 'magic';
  return undefined;
});


const hide = ref(false)

watch(nodeType, ()=>{
  if (nodeType.value === 'table' || nodeType.value === 'magic'){
    hide.value = true
  }else{
    hide.value = false
  }
})

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
	<div class="bubble-menu-bar" v-if="!hide">
    <template v-if="nodeType === 'text'">
      <ai-ext :options="{completions:AICompletions}"/>
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

<style scoped>
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
