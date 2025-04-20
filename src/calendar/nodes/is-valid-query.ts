import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { isValidSqlQuery, systemMessage } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  isValid: z.boolean().describe("Whether the SQL query is valid or not"),
});

export const isValidQueryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = isValidSqlQuery(state.query);

  const response = await structuredLLM.invoke([
    new SystemMessage({
      content: systemMessage(),
    }),
    new HumanMessage({
      content: prompt,
    }),
  ]);

  return {
    isValid: response.isValid,
  };
};
