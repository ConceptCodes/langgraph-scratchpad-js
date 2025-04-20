import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { generateSqlQueryPrompt, systemMessagePrompt } from "../agent/prompts";
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

  const messages = state.messages.map((message) => message.content as string);

  const prompt = generateSqlQueryPrompt(
    lastMessage?.content as string,
    messages,
    state.queryResults,
    state.metadata
  );

  const { query } = await structuredLLM.invoke([
    new SystemMessage({
      content: systemMessagePrompt(),
    }),
    new HumanMessage({
      content: prompt,
    }),
  ]);

  return {
    query,
  };
};
