import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { SectionStateAnnotation } from "../agent/state";
import { queryWriterInstructions } from "../agent/prompts";

const outputSchema = z.object({
  searchQuery: z.string(),
});

type Output = Partial<typeof SectionStateAnnotation.State>;

export const generateQueryNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<Output> => {
  const { section } = state;

  console.log("Generating query for section:", section.title);

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = queryWriterInstructions(
    section.title,
    section.description,
    section.research
  );

  const { searchQuery } = await structuredLLM.invoke([
    new SystemMessage({
      content: prompt,
    }),
    new HumanMessage("Generate a query for web search:"),
  ]);

  return { searchQuery };
};
