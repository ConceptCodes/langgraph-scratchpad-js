import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { isValidSqlQueryPrompt, systemMessagePrompt } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  isValid: z.boolean().describe("Whether the SQL query is valid or not"),
});

export const isValidQueryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { query, messages, metadata } = state;
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const lastMessage = messages.at(-1)?.content as string;

  const prompt = isValidSqlQueryPrompt(query, lastMessage, metadata);

  const { isValid } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  return { isValid };
};
