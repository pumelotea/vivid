<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { ref } from "vue";
	import VividMathModal from "./VividMathModal.vue";
	import { useMath } from "./math";
	import {
		injectExtension,
		onEditorCreated,
		useEditorInstance,
	} from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();
	injectExtension(useMath());

	const HTM = ref<any>(null);

	function handleOpenMath() {
		const val = "";
		HTM.value.open(val);
	}

	onEditorCreated(() => {
		editorInstance.value.storage["hb-math"] = {
			openEditor: handleOpenMath,
		};
	});

	function setMath(val: string) {
		editorInstance.value.chain().focus().setHbMath({ tex: val }).run();
	}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="functions"
				title="数学公式"
				:action="handleOpenMath"
				:is-active="() => editorInstance.isActive('hb-math')"
			/>
			<vivid-math-modal ref="HTM" @ok="setMath" />
		</slot>
	</div>
</template>

<style scoped></style>
