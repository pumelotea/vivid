import editor from './editor.vue'
function install(app) {
  app.component('VividEditor', editor)
}
editor.install = install
export default editor
