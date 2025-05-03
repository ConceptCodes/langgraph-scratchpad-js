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
import { draftOrderSchema, querySchema } from "../helpers/types";

export const itemSelectionNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages } = state;
  const lastMessage = messages.at(-1);

  const tableDefinition = getTableDefinitions();
  const systemMessage = itemSelectionSystemPrompt(tableDefinition);
  const structuredLLM = llm.withStructuredOutput(querySchema);
  let prompt = `Here is the user message: "${lastMessage?.content}".`;

  const { query, params } = await structuredLLM.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(prompt),
  ]);

  const result = await executeQuery(query, params);
  prompt = convertSqlResultToDraftOrderPrompt(result, prompt);
  const draftOrderLLM = llm.withStructuredOutput(draftOrderSchema);

  const draft = await draftOrderLLM.invoke([new HumanMessage(prompt)]);

  return { draft };
};
