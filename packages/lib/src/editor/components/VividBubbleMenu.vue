<script setup>
	import { useThemeVars } from "naive-ui";
	const vars = useThemeVars();
	import {
		BoldExt,
		ColorExt,
		HighlightExt,
		ItalicExt,
		StrikeExt,
		UnderlineExt,
		TextAlignExt,
		DividerExt,
	} from "../../core/extension";
	import ImageBubbleMenu from "../../core/extension/image/ImageBubbleMenu.vue";
	import VideoBubbleMenu from "../../core/extension/video/VideoBubbleMenu.vue";
	import TableBubbleMenu from "../../core/extension/table/TableBubbleMenu.vue";

	defineProps({
		nodeType: {
			type: String | undefined,
			default: undefined,
		},
	});
</script>
<template>
	<div class="bubble-menu-bar" v-show="nodeType">
		<template v-if="nodeType === 'text'">
			<bold-ext />
			<italic-ext />
			<strike-ext />
			<underline-ext />
			<color-ext />
			<highlight-ext />
			<divider-ext />
			<text-align-ext />
		</template>
		<template v-if="nodeType === 'image'">
			<image-bubble-menu />
		</template>
		<template v-if="nodeType === 'video'">
			<video-bubble-menu />
		</template>
		<template v-if="nodeType === 'video'">
			<table-bubble-menu />
		</template>
	</div>
</template>

<style scoped>
	.bubble-menu-bar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 5px 5px;
		border-radius: 3px;
	}
</style>
