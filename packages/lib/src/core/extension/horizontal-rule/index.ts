import HorizontalRule, { HorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import HorizontalRuleExt from "./HorizontalRule.vue";

export function useHorizontalRule(options?: Partial<HorizontalRuleOptions>) {
	return HorizontalRule.configure(options);
}

export { HorizontalRuleExt };
