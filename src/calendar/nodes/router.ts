import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";
import { routerPrompt, systemMessagePrompt } from "../agent/prompts";

const options = [Nodes.GENERAL, Nodes.GATHER_REQUIREMENTS] as const;

const outputSchema = z.object({
  next: z.enum(options),
});

export const routerNode = async (state: typeof AgentStateAnnotation.State) => {
  const lastMessage = state.messages.at(-1);

  const prompt = routerPrompt([...options], lastMessage?.content as string);

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const { next } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  return { next };
};
