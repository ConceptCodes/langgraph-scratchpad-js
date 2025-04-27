import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { createPersonalityPrompt } from "../agent/prompts";
import type { Player } from "../helpers/types";

export const outputSchema = z.object({
  bio: z.string(),
});

export const createPersonalityNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { players } = state;
  const currentPlayer = players.shift();

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = createPersonalityPrompt(currentPlayer?.name!);

  const { bio } = await structuredLLM.invoke([new HumanMessage(prompt)]);

  const updatedPlayer = {
    ...currentPlayer,
    bio,
  } as Player;

  return {
    players: [updatedPlayer],
  };
};
