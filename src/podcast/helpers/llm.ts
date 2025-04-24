import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// const model = "gemma3:12b";

// export const llm = new ChatOllama({
//   model,
//   temperature: 0.3,
// });

export const llm = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
