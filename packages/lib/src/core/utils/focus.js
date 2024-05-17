import { onBeforeUnmount, ref } from 'vue'
import { useMutationObserver } from '@vueuse/core'

export function useFocus() {
	const Wrap = ref()
	const isFocus = ref(false)
	const observer = useMutationObserver(
		Wrap,
		(mutations) => {
			if (!Wrap.value.$el.classList.contains('has-focus')) {
				isFocus.value = false
			}
			if (Wrap.value.$el.classList.contains('has-focus')) {
				isFocus.value = true
			}
		},
		{
			attributes: true,
		}
	)
	onBeforeUnmount(() => {
		observer.stop()
	})

	return {
		Wrap,
		isFocus,
	}
}
