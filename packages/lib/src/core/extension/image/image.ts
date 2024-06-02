import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { Image as TiptapImage } from "@tiptap/extension-image";
import ImageView from "./ImageView.vue";


export type Display = "block" | "inline" | "left" | "right"

export type UploadFunction = (file: File, updateProgress: (percent: number) => void) => Promise<string>

export interface ImageAttrsOptions {
  /** The source URL of the image. */
  src?: string;
  /** The alternative text for the image. */
  alt?: string;
  /** The title of the image. */
  title?: string;
  /** Indicates whether the aspect ratio of the image should be locked. */
	keepRatio?: boolean;
  /** The width of the image. */
  width?: number | string | null;
  /** The height of the image. */
  height?: number | string | null;
  /** The display style of the image. */
  display?: Display;
}

export interface SetImageAttrsOptions extends ImageAttrsOptions {
  /** The source URL of the image. */
  src: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
    };
  }
}

export function useImage() {
  return TiptapImage.extend({
    addOptions() {
      return {
        ...this.parent?.(),
        inline: true,
        HTMLAttributes: {},
      };
    },
    addNodeView() {
      return VueNodeViewRenderer(ImageView);
    },
    addAttributes() {
      return {
        src: {
          default: null,
        },
        alt: {
          default: null,
        },
        keepRatio: {
          default: true,
        },
        title: {
          default: null,
        },
        width: {
          default: "100%",
        },
        height: {
          default: null,
        },
        display: {
          default: "inline",
          renderHTML: ({ display }) => {
            if (!display) {
              return {};
            }
            return {
              "data-display": display,
            };
          },
          parseHTML: (element) => {
            const display = element.getAttribute("data-display");
            return display || "inline";
          },
        },
      };
    },

    addCommands() {
      return {
        ...this.parent?.(),
        updateImage:
          (options) =>
            ({ commands }) => {
              return commands.updateAttributes(this.name, options);
            },
      };
    },
  });
}
