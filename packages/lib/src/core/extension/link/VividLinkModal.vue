<script setup>
	import {
		NModal,
		NInputGroup,
		NSelect,
		NInput,
		NRadioGroup,
		NRadio,
		NForm,
		NFormItem,
		NButton,
		NSpace,
	} from "naive-ui";
	import { ref } from "vue";

	const showModal = ref(false);

	const href = ref("");
	const text = ref("");
	const target = ref("_blank");

	const emit = defineEmits(["ok"]);

	function open() {
		showModal.value = true;
		target.value = "_blank";
		href.value = "";
		text.value = "";
	}

	function onOk() {
		showModal.value = false;
		emit("ok", text.value, href.value, target.value);
	}

	function onCancel() {
		showModal.value = false;
	}

	defineExpose({ open });
</script>

<template>
	<n-modal v-model:show="showModal" preset="card" style="width: 450px">
		<template #header>
			<div>插入超链接</div>
		</template>
		<div>
			<n-form label-placement="left" label-width="auto">
				<n-form-item label="文字">
					<n-input-group>
						<n-input v-model:value="text" placeholder="在选中文字上添加内容请留空" />
					</n-input-group>
				</n-form-item>
				<n-form-item label="链接地址">
					<n-input-group>
						<n-input v-model:value="href" />
					</n-input-group>
				</n-form-item>
				<n-form-item label="打开方式">
					<n-radio-group v-model:value="target">
						<n-space>
							<n-radio value="_self"> 当前窗口 </n-radio>
							<n-radio value="_blank"> 新窗口 </n-radio>
						</n-space>
					</n-radio-group>
				</n-form-item>
			</n-form>
		</div>
		<template #footer>
			<n-space justify="end">
				<n-button @click="onCancel"> 取消 </n-button>
				<n-button type="info" @click="onOk"> 确定 </n-button>
			</n-space>
		</template>
	</n-modal>
</template>

<style scoped></style>
