import {VueNodeViewRenderer} from "@tiptap/vue-3";
import { Image as TiptapImage } from '@tiptap/extension-image';
import ImageView from "./ImageView.vue";

export function useImage(){
	return TiptapImage.extend({
		addOptions () {
			return {
				...this.parent?.(),
				inline        : true,
				HTMLAttributes: {}
			}
		},
		addNodeView() {
			return VueNodeViewRenderer(ImageView);
		},
		addAttributes () {
			return {
				src: {
					default: null
				},
				alt: {
					default: null
				},
				keepRatio: {
					default: true,
				},
				title: {
					default: null
				},
				width: {
					default: '100%',
				},
				height: {
					default: null,
				},
				display: {
					default: 'inline',
					renderHTML: ({ display }) => {
						if (!display) {
							return {};
						}
						return {
							'data-display': display,
						};
					},
					parseHTML: (element) => {
						const display = element.getAttribute('data-display');
						return display || 'inline';
					},
				},
			}
		},

		addCommands () {
			return {
				...this.parent?.(),
				updateImage: (options) =>
					({ commands }) => {
						return commands.updateAttributes(this.name, options);
					}
			}
		},
	})
}
