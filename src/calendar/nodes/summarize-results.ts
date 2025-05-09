import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { generateSummaryPrompt, systemMessagePrompt } from "../agent/prompts";

const outputSchema = z.object({
  summary: z.string().describe("The summary of the query results"),
});

export const summarizeResultsNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const lastMessage = state.messages.at(-1);
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = generateSummaryPrompt(
    state.queryResults,
    lastMessage?.content as string,
    state.query
  );

  const { summary } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  return {
    messages: [new AIMessage({ content: summary })],
  };
};
