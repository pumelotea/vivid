<script setup>
import { ref } from 'vue'
import { useThemeVars } from 'naive-ui'
const vars = useThemeVars()
const props = defineProps({
  icon: {
    type    : String,
    required: true
  },
  title: {
    type    : String,
    required: true
  },
  action: {
    type    : Function,
    required: true
  },
  isActive: {
    type   : Function,
    default: null
  }
})

const iconUrl = ref('')
</script>
<template>
  <button
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive(): null }"
    :title="title"
    @click="action"
  >
		<i :class="`ri-${icon}`"></i>
  </button>
</template>

<style scoped>
.menu-item {
  width: 28px;
  height: 28px;
  color: v-bind(vars.textColorBase);
  border: none;
  background-color: transparent;
  border-radius: 3px;
  padding: 5px;
  transition: all 0.2s;
  margin-left: 2px;
  margin-right: 2px;
	font-size: 18px;
  display: flex;
  align-items: center;
}
.menu-item+.menu-item{
  margin-left: 5px;
}

.menu-item:hover, .is-active {
  color: v-bind(vars.baseColor);
  background-color: v-bind(vars.textColorBase);
}
</style>
