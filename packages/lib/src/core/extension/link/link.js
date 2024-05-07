import Link from "@tiptap/extension-link";

export function useLink(options){
  if (!options){
    options = {
      protocols: [ 'ftp', 'mailto', 'http', 'https' ],
      autolink : false
    }
  }
  return Link.configure(options)
}
