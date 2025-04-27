import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// export const llm = new ChatOllama({
//   model: "gemma3:4b",
//   temperature: 0,
// });

export const llm = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
