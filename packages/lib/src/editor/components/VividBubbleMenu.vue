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


</script>
<template>
	<div class="bubble-menu-bar">
    <ai-ext/>
		<bold-ext/>
		<italic-ext/>
		<strike-ext/>
		<underline-ext/>
		<color-ext/>
		<highlight-ext/>
		<divider-ext/>
		<text-align-ext/>
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
