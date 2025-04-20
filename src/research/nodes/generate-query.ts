import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { SectionStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { queryWriterInstructions } from "../agent/prompts";

const outputSchema = z.object({
  searchQuery: z.string(),
});

export const generateQueryNode = async (
  state: typeof SectionStateAnnotation.State
) => {
  console.log("state", state);
  const { section } = state;
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = queryWriterInstructions(
    section.title, 
    section.description,
    section.research);

  const { searchQuery } = await structuredLLM.invoke([
    new SystemMessage({
      content: prompt,
    }),
    new HumanMessage("Generate a query for web search:"),
  ]);

  console.log("result", searchQuery);

  return {
    searchQuery,
  };
};
