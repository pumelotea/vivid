<script setup>
	import { ref } from "vue";
	import { useThemeVars, NTooltip } from "naive-ui";
	const vars = useThemeVars();
	const props = defineProps({
		icon: {
			type: String,
			required: false,
		},
		title: {
			type: String,
			required: true,
		},
		action: {
			type: Function,
			required: true,
		},
		isActive: {
			type: Function,
			default: null,
		},
	});

	const iconUrl = ref("");
</script>
<template>
	<div>
		<n-tooltip trigger="hover" style="border-radius: 10px">
			<template #trigger>
				<button
					class="menu-item"
					:class="{ 'is-active': isActive ? isActive() : null }"
					@click="action"
				>
					<slot>
						<i :class="`ri-${icon}`"></i>
					</slot>
				</button>
			</template>
			<div class="menu-title">
				{{ title }}
			</div>
		</n-tooltip>
	</div>
</template>

<style scoped>
	.menu-item {
		width: 28px;
		height: 28px;
		color: v-bind(vars.textColorBase);
		border: none;
		background-color: transparent;
		border-radius: 5px;
		padding: 5px;
		transition: all 0.2s;
		margin-left: 2px;
		margin-right: 2px;
		font-size: 18px;
		display: flex;
		align-items: center;
	}

	.menu-item:hover,
	.is-active {
		color: v-bind(vars.baseColor);
		background-color: v-bind(vars.textColorBase);
	}

	.menu-title {
		font-size: 12px;
		white-space: nowrap;
	}
</style>
