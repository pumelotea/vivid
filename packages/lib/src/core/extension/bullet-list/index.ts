import BulletList, {BulletListOptions} from '@tiptap/extension-bullet-list'
import BulletListExt from './BulletList.vue'

export function useBulletList(options? : Partial<BulletListOptions>) {
	return BulletList.configure(options)
}

export { BulletListExt }
