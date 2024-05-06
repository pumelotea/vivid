declare const _default: import("vue").DefineComponent<{}, {
    selected: boolean;
    editor: import("@tiptap/core").Editor;
    node: import("@tiptap/pm/model").Node;
    decorations: import("@tiptap/vue-3").DecorationWithType[];
    extension: import("@tiptap/vue-3").Node<any, any>;
    getPos: () => number;
    updateAttributes: (attributes: Record<string, any>) => void;
    deleteNode: () => void;
    $props: {
        readonly selected?: boolean | undefined;
        readonly editor?: import("@tiptap/core").Editor | undefined;
        readonly node?: import("@tiptap/pm/model").Node | undefined;
        readonly decorations?: import("@tiptap/vue-3").DecorationWithType[] | undefined;
        readonly extension?: import("@tiptap/vue-3").Node<any, any> | undefined;
        readonly getPos?: (() => number) | undefined;
        readonly updateAttributes?: ((attributes: Record<string, any>) => void) | undefined;
        readonly deleteNode?: (() => void) | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
