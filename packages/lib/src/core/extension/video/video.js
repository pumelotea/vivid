import {
  mergeAttributes,
  Node
} from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-3";
import VideoView from "./VideoView.vue";

export function useVideo() {
  const node = Node.create({
    name: 'video',
    atom: true,
    draggable: true,
    addOptions() {
      return {
        inline: true,
        HTMLAttributes: {}
      }
    },
    inline() {
      return this.options.inline
    },
    group() {
      return this.options.inline ? 'inline' : 'block'
    },
    addAttributes() {
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
        controls:{
          default: false,
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
    parseHTML() {
      return [
        {
          tag: 'video[src]'
        }
      ]
    },
    renderHTML({HTMLAttributes}) {
      return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    },
    addCommands() {
      return {
        setVideo: options => ({commands}) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          })
        },
        updateVideo: (options) =>
          ({commands}) => {
            return commands.updateAttributes(this.name, options);
          },
      }
    }
  })
  return node.extend({
    addNodeView() {
      return VueNodeViewRenderer(VideoView)
    }
  })
}
