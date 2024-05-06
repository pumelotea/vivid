declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{}, {
    getInstance: typeof getInstance;
    $emit: (event: "change" | "update:modelValue", ...args: any[]) => void;
    to: string;
    page: boolean;
    bubbleMenu: boolean;
    modelValue: string;
    tippyOptions: Record<string, any>;
    extensions: unknown[];
    onBeforeCreate?: Function | undefined;
    $props: {
        readonly to?: string | undefined;
        readonly page?: boolean | undefined;
        readonly bubbleMenu?: boolean | undefined;
        readonly modelValue?: string | undefined;
        readonly tippyOptions?: Record<string, any> | undefined;
        readonly extensions?: unknown[] | undefined;
        readonly onBeforeCreate?: Function | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>, {
    "bubble-menu"?(_: {
        data: {
            editor: import("@tiptap/vue-3").Editor;
            extensions: unknown[];
        };
    }): any;
    menu?(_: {
        data: {
            editor: import("@tiptap/vue-3").Editor;
            extensions: unknown[];
        };
    }): any;
}>;
export default _default;
declare function getInstance(): any;
type __VLS_WithTemplateSlots<T, S> = T & (new () => {
    $slots: S;
});
