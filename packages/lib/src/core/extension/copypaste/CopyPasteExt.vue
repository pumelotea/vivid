<script setup lang="ts">
	import { injectExtension, useEditorInstance } from "../utils/common";
	import { useCopyPaste } from "@lib/core/extension/copypaste/copypaste";

	const editor = useEditorInstance();
	injectExtension(useCopyPaste());
</script>

<template></template>

<style scoped></style>
