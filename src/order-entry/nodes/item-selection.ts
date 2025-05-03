import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { getTableDefinitions } from "../helpers/db";
import {
  convertSqlResultToDraftOrderPrompt,
  itemSelectionSystemPrompt,
} from "../agent/prompts";
import { executeQuery } from "../helpers/db";
import { draftOrderSchema } from "../helpers/types";

const outputSchema = z.object({
  query: z.string(),
});

export const itemSelectionNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages } = state;
  const lastMessage = messages.at(-1);

  const tableDefinition = getTableDefinitions();
  const systemMessage = itemSelectionSystemPrompt(tableDefinition);
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  let prompt = `Here is the user message: "${lastMessage?.content}".`;

  console.log("Prompt:", prompt);

  const { query } = await structuredLLM.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(prompt),
  ]);

  const result = await executeQuery(query);
  prompt = convertSqlResultToDraftOrderPrompt(result);
  const draftOrderLLM = llm.withStructuredOutput(draftOrderSchema);

  const draft = await draftOrderLLM.invoke([new HumanMessage(prompt)]);

  console.log("Draft Order:", draft);

  return { draft };
};
