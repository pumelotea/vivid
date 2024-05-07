<script setup lang="ts">
import {useThemeVars} from "naive-ui";

const vars = useThemeVars()
</script>

<template>
  <div class="divider"/>
</template>

<style scoped>
.divider {
  width: 2px;
  height: 20px;
  background-color: v-bind(vars.borderColor);
  margin-left: 2px;
  margin-right: 2px;
}
</style>
