import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { DiscussionStateAnnotation } from "../agent/state";
import { respondToDiscussionPrompt, systemPrompt } from "../agent/prompts";

const outputSchema = z.object({
  stance: z
    .enum(["agree", "disagree", "neutral"])
    .describe("Reaction to the last statement"),
  reason: z.string().describe("Reason for their reaction"),
});

export const respondToDiscussionNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const { members, publicChat, privateChat, phase } = state;
  const chatLog = phase === "day" ? publicChat : privateChat;

  const lastMessage = chatLog.at(-1)?.content as string;
  const lastSpeakerName = lastMessage?.split(":")[0];

  const availableResponders = members.filter((m) => m.name !== lastSpeakerName);
  const responder =
    availableResponders.length > 0
      ? availableResponders[
          Math.floor(Math.random() * availableResponders.length)
        ]
      : members[Math.floor(Math.random() * members.length)];

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = respondToDiscussionPrompt(
    responder?.name!,
    responder?.bio!,
    responder?.role!,
    chatLog.map((message) => message?.content as string)
  );

  const { stance, reason } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  let response = "";
  switch (stance) {
    case "agree":
      response = `${responder?.name}: I agree with the last statement. ${reason}`;
      break;
    case "disagree":
      response = `${responder?.name}: I disagree with the last statement. ${reason}`;
      break;
    case "neutral":
      response = `${responder?.name}: I have no strong opinion on the last statement. ${reason}`;
      break;
  }

  return {
    chatLog: [new AIMessage(response)],
  };
};
