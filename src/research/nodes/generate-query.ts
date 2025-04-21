import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import { queryWriterInstructions } from "../agent/prompts";
import type { SectionStateAnnotation } from "../agent/state";

const outputSchema = z.object({
  searchQueries: z.string().array().describe("List of search queries"),
});

export const generateQueryNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<typeof SectionStateAnnotation.Update> => {
  const { section } = state;
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = queryWriterInstructions(
    section.title,
    section.description,
    section.research
  );

  const { searchQueries } = await structuredLLM.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage("Generate a query for web search:"),
  ]);

  return { searchQueries };
};
