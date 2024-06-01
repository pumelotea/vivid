import Editor from './Editor.vue'
import {App} from "vue";
function install(app: App) {
	app.component('VividEditor', Editor)
	app.component('viv-editor', Editor)
}
Editor.install = install
export default Editor
