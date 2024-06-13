import AiExt from "./Ai.vue";
import { APIPromise } from "openai/core";
import { Stream } from "openai/streaming";
import OpenAI from "openai/index";
import ChatCompletionChunk = OpenAI.ChatCompletionChunk;

export declare interface AiOption {
	completions: (text: string, key: string) => APIPromise<Stream<ChatCompletionChunk>>;
}

export { AiExt };
