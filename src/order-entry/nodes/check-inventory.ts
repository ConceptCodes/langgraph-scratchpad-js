import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import { llm } from "../helpers/llm";
import { checkInventoryPrompt } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { executeQuery, getTableDefinitions } from "../helpers/db";
import { querySchema } from "../helpers/types";

export const checkInventoryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages, prev } = state;
  const lastMessage = messages.at(-1);

  const tableDefinition = getTableDefinitions();
  const systemMessage = checkInventoryPrompt(tableDefinition);
  const structuredLLM = llm.withStructuredOutput(querySchema);

  const { query, params } = await structuredLLM.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(lastMessage?.text!),
  ]);

  const result = await executeQuery(query, params);

  return new Command({
    goto: prev,
    update: {
      prev: "",
      queryResults: result,
    },
  });
};
