import { Editor, Extension } from "@tiptap/core";
import { UploadFunction, UploadInfo } from "@lib/core/extension/types";
import UploadingView from "@lib/core/extension/upload-manager/UploadingView.vue";
import { VueRenderer } from "@tiptap/vue-3";
import { type EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";

export interface UploadManagerOptions {
  handleUpload?: UploadFunction;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    uploadManager: {
      /**
       * Add an image
       */
      upload: (uploadList: UploadInfo[]) => ReturnType
    };
  }
}

function createUploadView(info: UploadInfo, options: UploadManagerOptions, view: EditorView, editor: Editor) {
  const id = {};
  const tr = view.state.tr;
  const file = info.file;
  const pos = info.pos - 1;


  const onSuccess = (url: string) => {
    const { schema } = view.state;
    const pos = findPlaceholder(view.state, id);
    if (pos == null) return;
    const node = schema.nodes.image?.create({ src: url });
    if (!node) return;
    const transaction = view.state.tr.replaceWith(pos, pos, node).setMeta(uploadKey, { remove: [id] });
    view.dispatch(transaction);
  };

  const render = () => {
    const rendered = new VueRenderer(UploadingView, {
      props: {
        handleUpload: options.handleUpload,
        onSuccess: onSuccess,
        file: file,
      },
      editor,
    });
    rendered.updateProps({
      destroy: () => {
        rendered.destroy();
      },
    });
    return rendered
  };

  if (!tr.selection.empty) {
    tr.deleteSelection();
  }

  tr.setMeta(uploadKey, {
    add: [{ id, pos, info, render }],
  });
  view.dispatch(tr);

}

export function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state) as DecorationSet;
  const found = decos.find(undefined, undefined, spec => spec.id == id);
  return found.length ? found[0]?.from : null;
}

const uploadKey = new PluginKey("upload-manager");

export function useUploadManager(options: UploadManagerOptions) {
  return Extension.create({
    name: "upload-manager",
    addCommands() {
      return {
        upload: (uploadList) => {
          return ({ view }) => {
            uploadList.forEach(info => {
              // 创建vue组件
              createUploadView(info, options, view, this.editor);
            });
            return true;
          };
        },
      };
    },
    addProseMirrorPlugins() {
      const plugin = new Plugin({
        key: uploadKey,
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, set) {
            set = set.map(tr.mapping, tr.doc);
            //@ts-expect-error
            const action = tr.getMeta(this);
            if (action?.add) {
              action.add.forEach(({ id, pos, src, render, onSuccess }) => {
                const rendered = render()
                const deco = Decoration.widget(pos + 1, rendered.element, {
                  id,
                });
                set = set.add(tr.doc, [deco]);
              });
            } else if (action?.remove) {
              action.remove.forEach(id => {
                set = set.remove(set.find(undefined, undefined, spec => spec.id == id));
              });
            }
            return set;
          },
        },
      });
      return [plugin];
    },
  });
}
