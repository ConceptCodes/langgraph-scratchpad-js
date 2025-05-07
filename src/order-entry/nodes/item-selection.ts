import { Command } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { convertSqlResultToDraftOrderPrompt } from "../agent/prompts";
import { draftOrderSchema } from "../helpers/types";
import { Nodes } from "../helpers/constants";

export const itemSelectionNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages, queryResults } = state;
  const lastMessage = messages.at(-1);

  if (queryResults.length === 0) {
    return new Command({
      goto: Nodes.CHECK_INVENTORY,
      update: {
        prev: Nodes.ITEM_SELECTION,
      },
    });
  }

  const prompt = convertSqlResultToDraftOrderPrompt(
    queryResults,
    lastMessage?.text!
  );
  const draftOrderLLM = llm.withStructuredOutput(draftOrderSchema);
  const draft = await draftOrderLLM.invoke([new HumanMessage(prompt)]);

  return new Command({
    goto: Nodes.REVIEW_ORDER,
    update: {
      draft,
      queryResults: [],
      prev: "",
    },
  });
};
