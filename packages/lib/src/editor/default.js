import * as extension from '../core/extension'


export function useDefaultExtension(){
	const list = []
	Object.keys(extension).forEach(e => {
		if (!e.startsWith('use')){
			return
		}

		if (e==='useHocuspocus'){
			return
		}

		let item
		if (e === 'useTable'){
			item = extension[e]({resizable: true})
		}
		else if (e === 'useHighlight'){
			item = extension[e]({multicolor: true})
		}else {
			item = extension[e]()
		}

		if (Array.isArray(item)){
			list.push(...item)
		}else{
			list.push(item)
		}
	})
	return list
}
const extList = useDefaultExtension()
export default extList
