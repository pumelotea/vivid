import {Node} from 'prosemirror-model'
import { Transaction } from "@tiptap/pm/state";
export type UploadFunction = (file: File, updateProgress: (percent: number) => void) => Promise<string>



export interface UploadInfo {
  file: File
  pos: number
}
