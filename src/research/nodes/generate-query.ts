import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import { queryWriterInstructions } from "../agent/prompts";
import type { SectionStateAnnotation } from "../agent/state";
import { NUMBER_OF_QUERIES } from "../helpers/constants";

const outputSchema = z.object({
  searchQueries: z.string().array().describe("List of search queries"),
});

export const generateQueryNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<typeof SectionStateAnnotation.Update> => {
  const {
    section: { title, description },
  } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = queryWriterInstructions(title, description, NUMBER_OF_QUERIES);

  const { searchQueries } = await structuredLLM.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage("Generate a query for web search:"),
  ]);

  return { searchQueries };
};
