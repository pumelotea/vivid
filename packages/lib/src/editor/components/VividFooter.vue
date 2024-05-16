<script setup >
import {useThemeVars} from "naive-ui";

defineProps({
	words:{},
	characters:{},
})
const vars = useThemeVars()
</script>

<template>
  <div class="editor-footer">
		<div class="footer-item">
			短语 {{ words }}
		</div>
		<div class="footer-item">
			字符 {{ characters }}
		</div>
	</div>
</template>

<style scoped>
.editor-footer {
  width: 100%;
  border-top: 1px solid rgba(204, 204, 204, 0.3);
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  box-sizing: border-box;
  background-color: v-bind(vars.baseColor);
  gap: 10px;
}

.footer-item {
  font-size: 12px;
	color: v-bind(vars.textColor1);
}
</style>
