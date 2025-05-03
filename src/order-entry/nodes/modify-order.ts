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

  if (!queryResults) {
    return new Command({
      goto: Nodes.CHECK_INVENTORY,
      update: {
        prev: Nodes.MODIFY_ORDER,
        messages: [
          new HumanMessage(
            `Look for available modifiers for the items in the current draft order. draft order: ${JSON.stringify(
              draft,
              null,
              2
            )}`
          ),
        ],
      },
    });
  }

  // let prompt = checkModifierPrompt(draft, lastMessage?.content as string);

  const prompt = modifyOrderPrompt(
    draft,
    lastMessage?.content as string,
    queryResults
  );

  const structuredLLM = llm.withStructuredOutput(draftOrderSchema);
  const tmp = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return {
    draft: tmp,
    queryResults: [],
    prev: "",
  };
};
