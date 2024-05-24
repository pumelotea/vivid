<script setup>
import { inject } from 'vue'
import {TrailingNode} from "./trailing-node";
const editorInstance = inject('editorInstance')

const useExtension = inject('useExtension')
if (!useExtension) {
  throw new Error('TrailingNode component must under VividEditor menu slot')
}
useExtension(TrailingNode)

</script>

<template>
	<div style="display: none">
	</div>
</template>

<style scoped></style>
