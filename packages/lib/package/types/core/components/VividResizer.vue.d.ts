declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{}, {
    $emit: (event: "on-change", ...args: any[]) => void;
    w: number;
    h: number;
    selected: boolean;
    $props: {
        readonly w?: number | undefined;
        readonly h?: number | undefined;
        readonly selected?: boolean | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>, {
    default?(_: {
        width: number;
        height: number;
    }): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & (new () => {
    $slots: S;
});
