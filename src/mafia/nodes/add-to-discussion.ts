import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { DiscussionStateAnnotation } from "../agent/state";
import {
  suggestPlayerForEliminationTown,
  suggestPlayerForEliminationMafia,
  systemPrompt,
  suggestPlayerForEliminationDetective,
  suggestPlayerForEliminationDoctor,
} from "../agent/prompts";

const outputSchema = z.object({
  target: z.string().describe("The name of the player to eliminate"),
  reason: z.string().describe("The reason for the elimination"),
});

export const addToDiscussionNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const {
    members,
    privateChat,
    publicChat,
    players,
    votes,
    eliminatedPlayers,
    protectedPlayers,
    investigatedPlayers,
  } = state;
  const speakingMember =
    members[Math.floor(Math.random() * members.length)] ?? members[0];

  const targets = players.filter(
    (player) =>
      !eliminatedPlayers.includes(player.name) &&
      player.name !== speakingMember?.name
  );

  const chatLog = speakingMember?.role === "mafia" ? privateChat : publicChat;

  const rolePromptMapping = {
    town: suggestPlayerForEliminationTown(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      chatLog.map((message) => message.content as string)
    ),
    mafia: suggestPlayerForEliminationMafia(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      chatLog.map((message) => message.content as string),
      members.map((member) => member.name)
    ),
    doctor: suggestPlayerForEliminationDoctor(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      chatLog.map((message) => message.content as string),
      protectedPlayers
    ),
    detective: suggestPlayerForEliminationDetective(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      chatLog.map((message) => message.content as string),
      investigatedPlayers
    ),
  };

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = rolePromptMapping[speakingMember?.role!];

  const { target, reason } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  const currentTally = votes[target] ?? 0;
  return {
    chatLog: [
      new AIMessage(
        `${speakingMember?.name}: I suggest ${target} for elimination. ${reason}`
      ),
    ],
    votes: { [target]: currentTally + 1 },
  };
};
