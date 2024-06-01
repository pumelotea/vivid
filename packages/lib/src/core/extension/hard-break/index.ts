import HardBreak, { HardBreakOptions } from "@tiptap/extension-hard-break";
import HardBreakExt from "./HardBreak.vue";

export function useHardBreak(options?: Partial<HardBreakOptions>) {
  return HardBreak.configure(options);
}

export { HardBreakExt };
