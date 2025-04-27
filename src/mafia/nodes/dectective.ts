import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { NightStateAnnotation } from "../agent/state";
import {
  choosePlayerToInvestigatePrompt,
  systemPrompt,
} from "../agent/prompts";

const outputSchema = z.object({
  player: z.string().describe("The name of the player to investigate"),
});

export const detectiveNode = async (
  state: typeof NightStateAnnotation.State
): Promise<typeof NightStateAnnotation.Update> => {
  const { players, publicChat, round, eliminatedPlayers } = state;

  const detective = players.find((player) => player.role === "detective");
  const playerNames = players
    .filter(
      (player) =>
        !eliminatedPlayers.includes(player.name) && player.role !== "detective"
    )
    .map((player) => player.name);

  const prompt = choosePlayerToInvestigatePrompt(
    detective?.name!,
    detective?.bio!,
    publicChat.map((message) => message?.content as string),
    playerNames
  );

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const { player } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  const targetRole = players.find((p) => p.name === player)?.role;

  return {
    investigatedPlayers: [{ name: player, role: targetRole! }],
    phase: "day",
    round: round + 1,
  };
};
