import { z } from "zod";

import { llm } from "../helpers/llm";
import type { NightStateAnnotation } from "../agent/state";
import { choosePlayerToProtectPrompt, systemPrompt } from "../agent/prompts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const outputSchema = z.object({
  player: z.string().describe("The name of the player to protect"),
});

export const doctorNode = async (
  state: typeof NightStateAnnotation.State
): Promise<typeof NightStateAnnotation.Update> => {
  const { players, publicChat, eliminatedPlayers, protectedPlayers } = state;

  const doctor = players.find((player) => player.role === "doctor");
  const playerNames = players
    .filter((player) => !eliminatedPlayers.includes(player.name))
    .map((player) => player.name);

  const prompt = choosePlayerToProtectPrompt(
    doctor?.name!,
    doctor?.bio!,
    publicChat.map((message) => message?.content as string),
    playerNames,
    protectedPlayers
  );

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const { player } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  return {
    protectedPlayers: [player],
  };
};
