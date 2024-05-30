<script setup>
import { isNumber, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Moveable from 'vue3-moveable'
import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'

const props = defineProps({
	...nodeViewProps,
	selected: {
		type: Boolean,
		required: true,
	},
})

const Wrap = ref()
const videoRef = ref(null)
const targetRef = ref()
const maxWidth = ref('auto')
const maxHeight = ref('auto')
const minWidth = ref('auto')
const minHeight = ref('auto')
const resizable = ref(true)
const rotatable = ref(false)
const keepRatio = ref(false)
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

const videoAttrs = computed(() => {
	const {
		src,
		alt,
		width: w,
		height: h,
		keepRatio,
		controls,
		loop,
		muted,
	} = props.node.attrs

	const width = isNumber(w) ? w + 'px' : w
	const height = keepRatio ? null : isNumber(h) ? h + 'px' : h

	return {
		src: src || undefined,
		alt: alt || undefined,
		controls: controls || false,
		loop: loop || false,
		muted: muted || false,
		style: {
			width: width || undefined,
			height: height || undefined,
		},
	}
})

const videoMaxStyle = computed(() => {
	const {
		style: { width },
	} = unref(videoAttrs)
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
			//TODO 拖动到100%后需要磁力锁定，然后往回拖动10px才解锁
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
	resizeState.value.width = videoAttrs.value.style.width
	resizeState.value.height = videoAttrs.value.style.height
	selectVideo()
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

function selectVideo() {
	const { editor, getPos } = props
	editor.commands.setNodeSelection(getPos())
}

</script>

<template>
	<node-view-wrapper
		ref="Wrap"
		as="span"
		class="vivid-video"
		:class="[props.node.attrs.display]"
		:style="videoMaxStyle"
	>
		<div class="vivid-video-container" :style="videoMaxStyle">
			<div
				class="move-box"
				:style="`max-width: ${maxWidth};max-height: ${maxHeight};min-width: ${minWidth};min-height: ${minHeight};width:${resizeState.width}px;height:${resizeState.height}px`"
				ref="targetRef"
			>
				<video
					:src="props.node.attrs.src"
					autoplay
					:style="videoAttrs.style"
					:controls="videoAttrs.controls"
					:loop="videoAttrs.loop"
					:muted="videoAttrs.muted"
				></video>
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
.vivid-video {
	line-height: 0;
	display: inline-block;
	vertical-align: baseline;
	max-width: 100%;
}

.vivid-video.left {
	float: left;
}

.vivid-video.right {
	float: right;
}

.vivid-video.inline {
	float: none;
}

.vivid-video-container {
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
