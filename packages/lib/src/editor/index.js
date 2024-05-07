import Editor from './Editor.vue'
function install(app) {
  app.component('VividEditor', Editor)
  app.component('viv-editor', Editor)
}
Editor.install = install
export default Editor
