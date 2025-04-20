import { ChatOllama } from "@langchain/ollama";

export const llm = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
});
