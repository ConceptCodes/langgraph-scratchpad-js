import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOllama({
    model: "gemma3:12b",
    temperature: 0,
  });

// const llm = new ChatOpenAI({
//   openAIApiKey: process.env.OPENAI_API_KEY,
//   modelName: "gpt-4o-mini",
//   temperature: 0,
// });

export { llm };
