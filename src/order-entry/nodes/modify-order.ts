import { z } from "zod";
import type { AgentStateAnnotation } from "../agent/state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { draftOrderSchema, querySchema } from "../helpers/types";
import {
  checkModifierPrompt,
  itemSelectionSystemPrompt,
  modifyOrderPrompt,
} from "../agent/prompts";
import { llm } from "../helpers/llm";
import { executeQuery, getTableDefinitions } from "../helpers/db";

export const modifyOrderNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { draft, messages } = state;
  const lastMessage = messages.at(-1);

  const tableDefinition = getTableDefinitions();
  let prompt = checkModifierPrompt(draft, lastMessage?.content as string);
  const structuredLLM = llm.withStructuredOutput(querySchema);

  const systemMessage = itemSelectionSystemPrompt(tableDefinition);
  const { query, params } = await structuredLLM.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(prompt),
  ]);

  const queryResult = await executeQuery(query, params);

  prompt = modifyOrderPrompt(
    draft,
    lastMessage?.content as string,
    queryResult
  );

  const modifierStructuredLLM = llm.withStructuredOutput(draftOrderSchema);
  const tmp = await modifierStructuredLLM.invoke([new HumanMessage(prompt)]);

  return {
    draft: tmp,
  };
};
