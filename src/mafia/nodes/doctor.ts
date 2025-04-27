import { z } from "zod";

import { llm } from "../helpers/llm";
import type { NightStateAnnotation } from "../agent/state";
import { choosePlayerToProtectPrompt } from "../agent/prompts";

const outputSchema = z.object({
  player: z.string().describe("The name of the player to protect"),
});

export const doctorNode = async (state: typeof NightStateAnnotation.State) => {
  const { players, chatLog } = state;

  const doctor = players.find((player) => player.role === "doctor");
  const playerNames = players
    .filter((player) => player.alive)
    .map((player) => player.name);

  const prompt = choosePlayerToProtectPrompt(
    doctor?.name,
    doctor?.bio,
    chatLog,
    playerNames
  );
};
