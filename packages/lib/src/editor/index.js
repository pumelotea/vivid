import Editor from './Editor.vue'
function install(app) {
  app.component('VividEditor', Editor)
}
Editor.install = install
export default Editor
