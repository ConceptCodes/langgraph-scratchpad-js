import { ChatOllama } from "@langchain/ollama";

export const llm = new ChatOllama({
  model: "gemma3:12b",
  temperature: 0,
});
