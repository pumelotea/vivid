import * as extension from '../core/extension'

const extList = []

Object.keys(extension).forEach(e => {
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
    extList.push(...item)
	}else{
		extList.push(item)
	}
})

export default extList
