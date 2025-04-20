import { ChatOllama } from "@langchain/ollama";

const model = "gemma3:4b";

export const llm = new ChatOllama({
  model,
  temperature: 0,
});
