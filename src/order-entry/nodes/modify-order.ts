import type { AgentStateAnnotation } from "../agent/state";
import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import { draftOrderSchema } from "../helpers/types";
import { llm } from "../helpers/llm";
import { Nodes } from "../helpers/constants";
import { checkModifierPrompt, modifyOrderPrompt } from "../agent/prompts";

export const modifyOrderNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { draft, messages, queryResults } = state;
  const lastMessage = messages.at(-1);

  let prompt = checkModifierPrompt(draft, lastMessage?.content as string);

  if (queryResults.length === 0) {
    return new Command({
      goto: Nodes.CHECK_INVENTORY,
      update: {
        prev: Nodes.MODIFY_ORDER,
        messages: [new HumanMessage(prompt)],
      },
    });
  }

  prompt = modifyOrderPrompt(
    draft,
    lastMessage?.content as string,
    queryResults
  );

  const structuredLLM = llm.withStructuredOutput(draftOrderSchema);
  const tmp = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return new Command({
    goto: Nodes.REVIEW_ORDER,
    update: {
      draft: tmp,
      queryResults: [],
      prev: "",
    },
  });
};
