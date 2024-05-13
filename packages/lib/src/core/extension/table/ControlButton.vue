<script setup>
import {NPopover} from 'naive-ui'
import {computed, onMounted, ref} from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  defaultColor: {
    type: String,
    default: 'none'
  },
  showDeleteContent: {
    type: Boolean,
    default: true
  },
  activeColor: {
    type: String,
    default: '#71bfff'
  },
  vertical: {
    type: Boolean,
    default: false
  },
  offset: {
    type: Number,
    default: 50
  }
})

const popoverPlacement = ref('top-start')

const btRef = ref()
let btWidth = 0
let btHeight = 0
const isNext = ref(false)

function addEvent() {
  if (btRef.value) {
    btRef.value.addEventListener('mousemove', e => {
      btWidth = btRef.value.offsetWidth
      btHeight = btRef.value.offsetHeight
      if (props.vertical) {
        if (e.offsetY * 2 > btHeight) {
          popoverPlacement.value = 'left-end'
          isNext.value = true
        } else {
          popoverPlacement.value = 'left-start'
          isNext.value = false
        }
      } else {
        if (e.offsetX * 2 > btWidth) {
          popoverPlacement.value = 'top-end'
          isNext.value = true
        } else {
          popoverPlacement.value = 'top-start'
          isNext.value = false
        }
      }
    })
  } else {
    setTimeout(() => {
      addEvent()
    }, 200)
  }
}

const trans = computed(() => {
  if (props.vertical) {
    if (isNext.value) {
      return `transform: translateY(${props.offset}%)`
    } else {
      return `transform: translateY(-${props.offset}%)`
    }
  } else {
    if (isNext.value) {
      return `transform: translateX(${props.offset}%)`
    } else {
      return `transform: translateX(-${props.offset}%)`
    }
  }
})

onMounted(() => {
  addEvent()
})

</script>

<template>
  <n-popover
      :to="false"
      :placement="popoverPlacement"
      trigger="hover"
      :show-arrow="false"
      :style="trans"
      content-style="padding: 0;"
      style="padding: 0;width: 20px;height: 20px;display: flex;justify-content: center;align-items: center;"
  >
    <template #trigger>
      <n-popover
          :to="false"
          content-style="padding: 0;"
          :show="active && showDeleteContent" :show-arrow="false" trigger="manual" :placement="vertical?'left':'top'"
          style="padding: 0;width: 20px;height: 20px;display: flex;justify-content: center;align-items: center;"
      >
        <template #trigger>
          <div
              ref="btRef"
              class="bt-div"
              :style="`background-color: ${props.active ? props.activeColor : props.defaultColor}`"
          >
            <slot/>
          </div>
        </template>
        <slot name="delete" v-if="showDeleteContent"></slot>
      </n-popover>
    </template>
    <div>
      <slot name="tool" :isNext="isNext"/>
    </div>

  </n-popover>
</template>

<style scoped>
.bt-div {
  width: 100%;
  height: 100%;
}

</style>
