<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import Heading from "@tiptap/extension-heading";
import {inject} from "vue";
import {NSpace} from 'naive-ui'

const props = defineProps({
  options: {
    type: Object,
    required: false
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Heading component must under VividEditor menu slot')
}
useExtension(Heading.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
      <n-space :size="2">
        <vivid-menu-item
            icon="h-1"
            title="标题1"
            :action="() => editorInstance.chain().focus().toggleHeading({level: 1}).run()"
            :is-active="() => editorInstance.isActive('heading', {level: 1})"
        />
        <vivid-menu-item
            icon="h-2"
            title="标题2"
            :action="() => editorInstance.chain().focus().toggleHeading({level: 2}).run()"
            :is-active="() => editorInstance.isActive('heading', {level: 2})"
        />
        <vivid-menu-item
            icon="h-3"
            title="标题3"
            :action="() => editorInstance.chain().focus().toggleHeading({level: 3}).run()"
            :is-active="() => editorInstance.isActive('heading', {level: 3})"
        />
        <vivid-menu-item
            icon="h-4"
            title="标题4"
            :action="() => editorInstance.chain().focus().toggleHeading({level: 4}).run()"
            :is-active="() => editorInstance.isActive('heading', {level: 4})"
        />
        <vivid-menu-item
            icon="h-5"
            title="标题5"
            :action="() => editorInstance.chain().focus().toggleHeading({level: 5}).run()"
            :is-active="() => editorInstance.isActive('heading', {level: 5})"
        />
        <vivid-menu-item
            icon="h-6"
            title="标题6"
            :action="() => editorInstance.chain().focus().toggleHeading({level: 6}).run()"
            :is-active="() => editorInstance.isActive('heading', {level: 6})"
        />
      </n-space>
		</slot>
	</div>
</template>

<style scoped>

</style>
