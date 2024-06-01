import Blockquote, {BlockquoteOptions} from '@tiptap/extension-blockquote'
import BlockQuoteExt from './BlockQuote.vue'

export function useBlockquote(options?: Partial<BlockquoteOptions>) {
  return Blockquote.configure(options)
}

export {BlockQuoteExt}
