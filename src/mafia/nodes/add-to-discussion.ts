import type { DiscussionStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { suggestPlayerForElimination } from "../agent/prompts";
import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

const outputSchema = z.object({
  target: z.string().describe("The name of the player to eliminate"),
  reason: z.string().describe("The reason for the elimination"),
});

export const addToDiscussionNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const { members, chatLog, players, votes } = state;
  const speakingMember = members[Math.floor(Math.random() * members.length)];

  const targets = players.filter(
    (player) => player.alive && player.name !== speakingMember?.name
  );

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = suggestPlayerForElimination(
    speakingMember?.name!,
    speakingMember?.bio!,
    speakingMember?.role!,
    targets.map((player) => player.name),
    chatLog.map((message) => message.content as string)
  );

  const { target, reason } = await structuredLLM.invoke([
    new HumanMessage(prompt),
  ]);

  const currentTally = votes[target] ?? 0;
  return {
    chatLog: [new AIMessage(`${speakingMember?.name}: ${reason}`)],
    votes: { [target]: currentTally + 1 },
  };
};
