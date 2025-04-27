import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

export const llm = new ChatOllama({
  model: "mistral",
  temperature: 0,
});

// Option 2: OpenAI (Requires API Key in .env)
// export const llm = new ChatOpenAI({
//   modelName: "gpt-4o-mini", // Or your preferred OpenAI model
//   temperature: 0,
//   openAIApiKey: process.env.OPENAI_API_KEY,
// });
