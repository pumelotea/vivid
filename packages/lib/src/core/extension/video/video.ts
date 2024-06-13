import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import VideoView from "./VideoView.vue";

export type Display = "block" | "inline" | "left" | "right";

export type UploadFunction = (
	file: File,
	updateProgress: (percent: number) => void,
) => Promise<string>;

export interface VideoAttrsOptions {
	/** The source URL of the image. */
	src?: string;
	/** The alternative text for the image. */
	alt?: string;
	/** The title of the image. */
	title?: string;
	/** Indicates whether the aspect ratio of the image should be locked. */
	keepRatio?: boolean;
	controls?: boolean;
	loop?: boolean;
	muted?: boolean;
	/** The width of the image. */
	width?: number | string | null;
	/** The height of the image. */
	height?: number | string | null;
	/** The display style of the image. */
	display?: Display;
}

export interface SetVideoAttrsOptions extends VideoAttrsOptions {
	/** The source URL of the image. */
	src: string;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		videoResize: {
			/**
			 * Add an image
			 */
			setVideo: (options: Partial<SetVideoAttrsOptions>) => ReturnType;
			/**
			 * Update an image
			 */
			updateVideo: (options: Partial<SetVideoAttrsOptions>) => ReturnType;
		};
	}
}

export function useVideo() {
	const node = Node.create({
		name: "video",
		atom: true,
		draggable: true,
		addOptions() {
			return {
				inline: true,
				HTMLAttributes: {},
			};
		},
		inline() {
			return this.options.inline;
		},
		group() {
			return this.options.inline ? "inline" : "block";
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
				controls: {
					default: false,
				},
				loop: {
					default: false,
				},
				muted: {
					default: false,
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
		parseHTML() {
			return [
				{
					tag: "video[src]",
				},
			];
		},
		renderHTML({ HTMLAttributes }) {
			return ["video", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
		},
		addCommands() {
			return {
				setVideo:
					(options) =>
					({ commands }) => {
						return commands.insertContent({
							type: this.name,
							attrs: options,
						});
					},
				updateVideo:
					(options) =>
					({ commands }) => {
						return commands.updateAttributes(this.name, options);
					},
			};
		},
	});
	return node.extend({
		addNodeView() {
			return VueNodeViewRenderer(VideoView);
		},
	});
}
