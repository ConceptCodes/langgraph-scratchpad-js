import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { generateSqlQueryPrompt, systemMessagePrompt } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  query: z
    .string()
    .describe("The generated SQL query based on the user request"),
  params: z
    .array(z.string())
    .describe("The parameters for the SQL query, if any"),
});

export const generateQueryNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { messages, metadata, queryError, queryResults } = state;
  const lastMessage = messages.at(-1);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const prompt = generateSqlQueryPrompt(
    lastMessage?.content as string,
    queryResults,
    metadata,
    queryError.message
  );

  const { query, params } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  return { query, params };
};
