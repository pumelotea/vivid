import { Extension,Range } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { DOMParser as TipTapDOMParser, DOMSerializer, Node } from "prosemirror-model";


declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    copyPaste: {
      copyRange: (range:Range, node: Node) => ReturnType
      insertHtml: (html: string) => ReturnType
    };
  }
}

export function useCopyPaste(){
  return Extension.create({
    name: 'handleCopyPaste',
    addCommands() {
      return {
        copyRange: (range:Range, node: Node) => {
          return ({ state, dispatch }) =>{
            this.editor.chain().focus().setNodeSelection(range.from).run();
            const serializer = DOMSerializer.fromSchema(this.editor.schema);
            if (node) {
              const html = serializer.serializeNode(node);
              const div = document.createElement("div");
              div.append(html);
              navigator.clipboard.writeText(div.innerHTML);
              return true
            }
            return false
          }
        },
        insertHtml: (innerHTML: string) => {
          return ({  view ,state, dispatch }) => {
            const parserHtml = new DOMParser();
            const parser = TipTapDOMParser.fromSchema(view.state.schema);
            const serializer = DOMSerializer.fromSchema(view.state.schema);
            // string -> html dom
            const dom = parserHtml.parseFromString(innerHTML, "text/html");
            // html dom -> pm node
            const node = parser.parse(dom.body.firstChild!);
            // console.log('handlePaste string',innerHTML)
            // console.log('handlePaste string -> html',dom)
            // console.log('handlePaste html -> node', node)
            // console.log('handlePaste node -> html', serializer.serializeFragment(node.content))
            if (dom.body.firstChild!.nodeName === "#text") {
              return true;
            } else {
              const from = view.state.selection.from - 1;
              state.tr.insert(from, node.content)
              dispatch!()
              return false
            }
          }
        }
      }
    },
    addStorage(){
      return {}
    },
    addProseMirrorPlugins() {
      const editor = this.editor
      const plugin = new Plugin({
        key: new PluginKey("handleCopyPaste"),
        props: {
          handlePaste: (view, event, p) => {
            function hasImageExt(){
              return editor.extensionManager.extensions.find(e => e.name === 'image');
            }
            const files = event.clipboardData!.files
            const imageExt = hasImageExt()
            if (imageExt && files && files.length){
              const fileList: File[] = []
              for (let i = 0; i < files.length; i++) {
                const file = files.item(i)
                if (!file){
                  continue
                }
                if (!file.type.startsWith('image')){
                  continue
                }
                fileList.push(file)
              }
              editor.storage.copypaste.handelOpenUpload(fileList)
              return true
            }

            const html = event.clipboardData!.getData("text/html");
            if (html) {
              return false;
            }

            const text = event.clipboardData!.getData("text");
            if (!text) {
              return false;
            }
            return !editor.commands.insertHtml(`<div>${text}</div>`)
          },
        },
      });
      return [plugin];
    },
  })
}
