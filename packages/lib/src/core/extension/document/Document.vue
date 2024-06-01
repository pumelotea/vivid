<script setup>
	import Document from "@tiptap/extension-document";
	import { injectExtension } from "../utils/common";

	injectExtension(Document.configure(props.options));
</script>

<template>
</template>
<style scoped></style>
