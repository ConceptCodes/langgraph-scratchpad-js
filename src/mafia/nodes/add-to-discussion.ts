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
import { Nodes } from "../helpers/constants";
import { Command } from "@langchain/langgraph";

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

  if (!members || members.length === 0) {
    console.error("No members available to speak in discussion.");
    return new Command({
      goto: Nodes.DISCUSSION,
    });
  }

  const speakingMember = members[Math.floor(Math.random() * members.length)];

  if (!speakingMember || !speakingMember.role) {
    console.error(
      "Selected speaking member or their role is invalid:",
      speakingMember
    );
    return new Command({
      goto: Nodes.DISCUSSION,
    });
  }

  const targets = players.filter(
    (player) =>
      !eliminatedPlayers.includes(player.name) &&
      player.name !== speakingMember?.name
  );

  if (!targets || targets.length === 0) {
    console.log("No valid targets remaining for elimination suggestion.");
    return new Command({
      goto: Nodes.DISCUSSION,
    });
  }

  const chatLog = speakingMember?.role === "mafia" ? privateChat : publicChat;

  const formattedChatLog = (chatLog || []).map(
    (message) => (message?.content as string) ?? ""
  );

  const rolePromptMapping: { [key: string]: string | undefined } = {
    town: suggestPlayerForEliminationTown(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      formattedChatLog
    ),
    mafia: suggestPlayerForEliminationMafia(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      formattedChatLog,
      members.map((member) => member.name)
    ),
    doctor: suggestPlayerForEliminationDoctor(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      formattedChatLog,
      protectedPlayers
    ),
    detective: suggestPlayerForEliminationDetective(
      speakingMember?.name!,
      speakingMember?.bio!,
      targets.map((player) => player.name),
      formattedChatLog,
      investigatedPlayers
    ),
  };

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = rolePromptMapping[speakingMember.role];

  if (typeof prompt !== "string" || !prompt) {
    console.error(
      `Could not generate a valid prompt for role: ${speakingMember.role}`
    );
    return new Command({
      goto: Nodes.DISCUSSION,
    });
  }

  const { target, reason } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  const isValidTarget = targets.some((p) => p.name === target);
  if (!isValidTarget) {
    console.warn(`LLM suggested an invalid target: ${target}. Ignoring vote.`);
    return {
      chatLog: [
        new AIMessage(
          `${speakingMember?.name}: I suggest ${target} for elimination. ${reason}`
        ),
      ],
    };
  }

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
