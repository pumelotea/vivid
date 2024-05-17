import HorizontalRule from '@tiptap/extension-horizontal-rule'
import HorizontalRuleExt from './HorizontalRule.vue'

export function useHorizontalRule(options) {
	return HorizontalRule.configure(options)
}

export { HorizontalRuleExt }
