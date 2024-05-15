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

const editorInstance = inject('editorInstance')

const nodeType = computed(() => {
  const selection = editorInstance.value.state.selection
  const isImage = selection.node?.type.name === 'image';
  const isVideo = selection.node?.type.name === 'hb-video';
  const isCell = selection instanceof CellSelection;
  const isTable = selection.node?.type.name === 'table' || isCell; // 选中表格或者单元格
  const isText = selection instanceof TextSelection;
  if (isImage) return 'image';
  if (isVideo) return 'video';
  if (isTable) return 'table';
  if (isText) return 'text';
  return undefined;
});


const hide = ref(false)

watch(nodeType, ()=>{
  if (nodeType.value === 'table'){
    hide.value = true
  }else{
    hide.value = false
  }
})


</script>
<template>
	<div class="bubble-menu-bar" v-if="!hide">
    <template v-if="nodeType === 'text'">
      <ai-ext/>
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
