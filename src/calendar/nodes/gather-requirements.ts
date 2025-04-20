import { z } from "zod";
import { interrupt } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { gatherRequirementsPrompt, systemMessage } from "../agent/prompts";
import { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  followupQuestions: z
    .string()
    .array()
    .optional()
    .describe("Followup questions to ask the user if one is needed"),
});

export const gatherRequirementsNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const lastMessage = state.messages.at(-1);
  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = gatherRequirementsPrompt(lastMessage?.content as string);

  const response = await structuredLLM.invoke([
    new SystemMessage({
      content: systemMessage(),
    }),
    new HumanMessage({
      content: prompt,
    }),
  ]);

  const metadata: Record<string, string> = {};

  if (response.followupQuestions) {
    for (const question of response.followupQuestions) {
      const ans = interrupt(question);
      if (ans) {
        metadata[question] = ans;
      }
    }
  }

  return {
    metadata,
  };
};
