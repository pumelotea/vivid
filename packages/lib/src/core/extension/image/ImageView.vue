<script setup>
import {
	isNumber,
	NodeViewContent,
	nodeViewProps,
	NodeViewWrapper,
} from '@tiptap/vue-3'
import Moveable from 'vue3-moveable'
import { computed, nextTick, onMounted, ref, toRaw, unref, watch } from 'vue'

const props = defineProps({
	...nodeViewProps,
	selected: {
		type: Boolean,
		required: true,
	},
})

const Wrap = ref()
const targetRef = ref()
const maxWidth = ref('auto')
const maxHeight = ref('auto')
const minWidth = ref('auto')
const minHeight = ref('auto')
const resizable = ref(true)
const rotatable = ref(false)
const keepRatio = ref(true)
const throttleResize = ref(1)
const renderDirections = ref(['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'])

function updateAttr({ width, height, transform }) {
	props.updateAttributes({
		keepRatio: keepRatio.value,
		width,
		height,
		transform,
	})
}

const imgAttrs = computed(() => {
	const { src, alt, width: w, height: h, keepRatio } = props.node.attrs

	const width = isNumber(w) ? w + 'px' : w
	const height = keepRatio ? null : isNumber(h) ? h + 'px' : h

	return {
		src: src || undefined,
		alt: alt || undefined,
		style: {
			width: width || undefined,
			height: height || undefined,
		},
	}
})

const imageMaxStyle = computed(() => {
	const {
		style: { width },
	} = unref(imgAttrs)
	return { width: width === '100%' ? width : undefined }
})

const isResizing = ref(false)

const resizeState = ref({
	width: undefined,
	height: undefined,
})

function onResizeStart() {
	isResizing.value = true
}

const onResize = async (e) => {
	isResizing.value = true
	e.width = Math.round(e.width)
	e.height = Math.round(e.height)

	const maxWidth = Math.round(
		Wrap.value.$el.parentNode.getBoundingClientRect().width
	)
	if (keepRatio.value) {
		if (e.width >= maxWidth) {
			e.width = maxWidth
			e.height = e.width / e.startRatio
			updateAttr({
				width: '100%',
				height: e.height,
			})
			return
		}
	}

	updateAttr({
		width: e.width,
		height: e.height,
	})

	e.target.style.width = `${e.width}px`
	e.target.style.height = `${e.height}px`
}

function onResizeEnd(e) {
	isResizing.value = false
	resizeState.value.width = imgAttrs.value.style.width
	resizeState.value.height = imgAttrs.value.style.height
	selectImage()
}

watch(
	() => props.node.attrs,
	() => {
		keepRatio.value = props.node.attrs.keepRatio
	},
	{
		immediate: true,
		deep: true,
	}
)

function selectImage() {
	const { editor, getPos } = props
	editor.commands.setNodeSelection(getPos())
}
</script>

<template>
	<node-view-wrapper
		ref="Wrap"
		class="vivid-image"
		as="span"
		:class="[props.node.attrs.display]"
		:style="imageMaxStyle"
	>
		<div class="vivid-image-container" :style="imageMaxStyle">
			<div
				class="move-box"
				:style="`max-width: ${maxWidth};max-height: ${maxHeight};min-width: ${minWidth};min-height: ${minHeight};width:${resizeState.width}px;height:${resizeState.height}px`"
				ref="targetRef"
			>
				<img :src="imgAttrs.src" :alt="imgAttrs.alt" :style="imgAttrs.style" />
			</div>
			<Moveable
				v-if="selected || isResizing"
				:target="targetRef"
				:resizable="resizable && editor.isEditable"
				:rotatable="rotatable"
				:keepRatio="keepRatio"
				:throttleResize="throttleResize"
				:renderDirections="renderDirections"
				:useResizeObserver="true"
				@resize="onResize"
				@resizeEnd="onResizeEnd"
			></Moveable>
		</div>
	</node-view-wrapper>
</template>

<style scoped>
.vivid-image {
	line-height: 0;
	display: inline-block;
	vertical-align: baseline;
	max-width: 100%;
}

.vivid-image.left {
	float: left;
}

.vivid-image.right {
	float: right;
}

.vivid-image.inline {
	float: none;
}

.vivid-image-container {
	position: relative;
	display: inline-block;
	vertical-align: baseline;
	clear: both;
	max-width: 100%;
	z-index: 1;
}

.move-box {
	max-width: -webkit-fill-available;
}
</style>
