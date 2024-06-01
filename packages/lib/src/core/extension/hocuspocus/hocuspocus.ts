import { HocuspocusProvider, HocuspocusProviderConfiguration } from "@hocuspocus/provider";
import { Collaboration } from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { onBeforeUnmount } from "vue";

export function getRandomColor() {
  const letters = "BCDEF".split("");
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export function useHocuspocus(options: HocuspocusProviderConfiguration, user: Record<string, any>) {
  // Set up the Hocuspocus WebSocket provider
  const provider = new HocuspocusProvider(options);
  onBeforeUnmount(() => {
    provider.disconnect();
    provider.destroy();
  });
  return [
    Collaboration.configure({
      document: provider.document,
    }),
    CollaborationCursor.configure({
      provider,
      user,
    }),
  ];
}
