<script setup>
	import {
		NModal,
		NInputGroup,
		NProgress,
		NInput,
		NForm,
		NFormItem,
		NButton,
		NSpace,
		NTabs,
		NTabPane,
	} from "naive-ui";
	import VividSimpleUpload from "../../components/VividSimpleUpload.vue";
	import { ref, watch } from "vue";

	const showModal = ref(false);

	const tabName = ref("本地视频");

	const props = defineProps({
		handleUpload: {
			type: Function,
			required: false,
		},
	});
	function changeTab(name) {
		tabName.value = name;
		if (name === "本地视频") {
			readySave.value = false;
		}
		if (name === "网络视频") {
			readySave.value = !!url.value;
			readyFile.value = null;
		}
	}
	const href = ref("");

	const simpleUpload = ref(null);

	const emit = defineEmits(["ok"]);

	function open(attrs) {
		percent.value = 0;
		readyFile.value = null;
		readySave.value = false;
		showModal.value = true;
		tabName.value = "本地视频";
		href.value = attrs?.src || "";
	}

	const readyFile = ref(null);
	const readySave = ref(false);
	const url = ref("");
	function onOk() {
		showModal.value = false;
		emit("ok", url.value);
	}

	watch(href, () => {
		url.value = href.value;
		readySave.value = !!url.value;
	});

	const percent = ref(0);

	function updateProgress(n) {
		percent.value = n;
	}

	async function handleUpload() {
		if (props.handleUpload) {
			percent.value = 0;
			const path = await props.handleUpload(readyFile.value, updateProgress);
			url.value = path;
			href.value = url.value;
			readySave.value = true;
		} else {
			percent.value = 100;
			url.value = URL.createObjectURL(readyFile.value);
			href.value = url.value;
			readySave.value = true;
		}
	}

	function onCancel() {
		percent.value = 0;
		showModal.value = false;
		readySave.value = false;
	}

	function onChange(file) {
		percent.value = 0;
		readySave.value = false;
		url.value = "";
		readyFile.value = file;
	}

	defineExpose({ open });
</script>

<template>
	<n-modal v-model:show="showModal" preset="card" style="width: 450px">
		<template #header>
			<div>插入视频</div>
		</template>
		<div>
			<n-tabs type="line" animated :default-value="tabName" @update:value="changeTab">
				<n-tab-pane name="网络视频">
					<n-form label-placement="left" label-width="auto">
						<n-form-item label="地址">
							<n-input-group>
								<n-input v-model:value="href" />
							</n-input-group>
						</n-form-item>
					</n-form>
				</n-tab-pane>
				<n-tab-pane name="本地视频">
					<div style="padding: 15px; box-sizing: border-box">
						<vivid-simple-upload ref="simpleUpload" type="video" @change="onChange" />
					</div>
					<n-progress v-if="readyFile" :percentage="percent" />
				</n-tab-pane>
			</n-tabs>
		</div>
		<template #footer>
			<n-space justify="end">
				<n-button @click="onCancel"> 取消 </n-button>
				<n-button v-if="readyFile && !readySave" type="info" @click="handleUpload"> 上传 </n-button>
				<n-button v-if="readySave" type="success" @click="onOk"> 确定 </n-button>
			</n-space>
		</template>
	</n-modal>
</template>

<style scoped></style>
