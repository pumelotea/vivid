import BulletList from '@tiptap/extension-bullet-list'
import BulletListExt from './BulletList.vue'

export function useBulletList(options) {
	return BulletList.configure(options)
}

export { BulletListExt }
