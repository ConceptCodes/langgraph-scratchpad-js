import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";
import { parseIntentPrompt } from "../agent/prompts";

const options = [
  Nodes.ITEM_SELECTION,
  Nodes.MODIFY_ORDER,
  Nodes.REVIEW_ORDER,
] as const;

const outputSchema = z.object({
  next: z.enum(options),
});

export const parseIntentNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages } = state;
  const lastMessage = messages.at(-1);

  const prompt = parseIntentPrompt(lastMessage?.content as string, [
    ...options,
  ]);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { next } = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return new Command({
    goto: next,
  });
};
