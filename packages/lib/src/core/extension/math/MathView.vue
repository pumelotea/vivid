<script setup>
	import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
	import "katex/dist/katex.css";
	import katex from "katex";

	import { onMounted, ref, watch } from "vue";

	const props = defineProps(nodeViewProps);

	const box = ref(null);

	function init() {
		katex.render(props.node.attrs.tex, box.value, {
			throwOnError: false,
		});
	}

	watch(
		() => props.node.attrs.tex,
		() => {
			init();
		},
	);

	onMounted(() => {
		init();
	});
</script>
<template>
	<node-view-wrapper class="math-block">
		<p ref="box" :class="{ 'math-selected': props.selected }" />
	</node-view-wrapper>
</template>

<style scoped>
	.math-block {
		position: relative;
		max-width: 100%;
		box-sizing: border-box;
		display: inline-block;
		line-height: 0;
		float: none;
		vertical-align: baseline;
	}

	.math-selected {
		background: rgb(0 150 255 / 32%);
	}
</style>
