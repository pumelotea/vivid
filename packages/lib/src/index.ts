import VividEditor from './editor/index'
import VividMenuItem from './core/components/VividMenuItem.vue'

/**
 * 核心
 */
export {
	VividEditor,
	VividMenuItem
}

/**
 * 编辑器扩展包
 */
export {
	useBold,
	useBlockquote,
	useCode,
	useBulletList,
	useColor,
	useCharacterCount,
	useCodeBlock,
	useDocument,
	useDropcursor,
	useGapcursor,
	useHardBreak,
	useHeading,
	useHighlight,
	useHistory,
	useHocuspocus,
	useLink,
	useMath,
	useImage,
	useItalic,
	useIndent,
	useHorizontalRule,
	useListItem,
	useOrderedList,
	useParagraph,
	usePlaceholder,
	useStrike,
	useSubscript,
	useSuperscript,
	useTable,
	useText,
	useTaskList,
	useVideo,
	useUnderline,
	useTextAlign,
	useTextStyle,
	getRandomColor,
	useTaskItem,
	useFocus,
	useLineHeight,
	useTrailingNode,
	useSection
} from './core/extension'

/**
 * 编辑器扩展组件
 */
export {
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
	HocuspocusExt,
	FocusExt,
	DividerExt,
	FormatClearExt,
	FullscreenExt,
	UndoExt,
	RedoExt,
	LineHeightExt,
	AiExt,
	TrailingNodeExt,
	SectionExt
} from './core/extension'

/**
 * 编辑器组件
 */
export {
	ImageBubbleMenu,
	VideoBubbleMenu,
	TableBubbleMenu,
	MathBubbleMenu,
	DragHandle,
	SlashCommand,
} from './core/extension'

