<script setup>
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
		FocusExt,
		LineHeightExt,
		MathExt,
		TrailingNodeExt,
	} from "../../core/extension";
	import { useThemeVars } from "naive-ui";

	const vars = useThemeVars();
</script>
<template>
	<div class="menu-bar">
		<document-ext />
		<paragraph-ext />
		<hard-break-ext />
		<indent-ext />
		<history-ext />
		<dropcursor-ext />
		<gapcursor-ext />
		<text-ext />
		<placeholder-ext />
		<character-count-ext />
		<text-style-ext />
		<focus-ext />
		<trailing-node-ext />

		<undo-ext />
		<redo-ext />
		<format-clear-ext />
		<divider-ext />
		<bold-ext />
		<italic-ext />
		<strike-ext />
		<underline-ext />
		<color-ext />
		<highlight-ext />
		<divider-ext />
		<heading-ext />
		<divider-ext />
		<text-align-ext />
		<line-height-ext />
		<divider-ext />
		<subscript-ext />
		<superscript-ext />
		<divider-ext />
		<math-ext />
		<image-ext />
		<video-ext />
		<link-ext />
		<divider-ext />
		<table-ext />
		<code-ext />
		<code-block-ext />
		<block-quote-ext />
		<horizontal-rule-ext />
		<bullet-list-ext />
		<list-item-ext />
		<ordered-list-ext />
		<task-list-ext />
		<divider-ext />
		<fullscreen-ext />
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
