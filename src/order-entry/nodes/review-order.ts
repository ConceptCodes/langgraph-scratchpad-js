import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { reviewOrderPrompt } from "../agent/prompts";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  statement: z.string(),
});

export const reviewOrderNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { draft } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = reviewOrderPrompt(draft);
  const { statement } = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return new Command({
    goto: Nodes.AUDIO_OUTPUT,
    update: {
      messages: [new AIMessage(statement)],
    },
  });
};
