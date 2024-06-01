<script setup lang="ts">
	import Text from "@tiptap/extension-text";
	import { injectExtension } from "@lib/core/extension/utils/common";


	injectExtension(Text.configure(props.options));
</script>

<template>
</template>

<style scoped></style>
