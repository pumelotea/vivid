import Bold, {BoldOptions} from '@tiptap/extension-bold'
import BoldExt from './Bold.vue'

export function useBold(options?: Partial<BoldOptions>) {
  return Bold.configure(options)
}

export {BoldExt}
