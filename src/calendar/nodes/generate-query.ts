import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { generateSqlQuery, systemMessage } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  query: z
    .string()
    .describe("The generated SQL query based on the user request"),
});

export const generateQueryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const lastMessage = state.messages.at(-1);
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = generateSqlQuery(
    lastMessage?.content as string,
    state.queryResults,
    state.metadata
  );

  const response = await structuredLLM.invoke([
    new SystemMessage({
      content: systemMessage(),
    }),
    new HumanMessage({
      content: prompt,
    }),
  ]);

  return {
    query: response.query,
  };
};
