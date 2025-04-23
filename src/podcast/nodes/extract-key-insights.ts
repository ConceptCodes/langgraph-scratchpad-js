import z from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import {
  extractKeyInsightInstructions,
  extractKeyInsightsPrompts,
  extractKeyInsightsWithFeedbackInstructions,
} from "../agent/prompts";

const outputSchema = z.object({
  topics: z.string().array().describe("Main topics from the source material"),
  quotes: z.string().array().describe("Quotes from the source material"),
  insights: z
    .string()
    .array()
    .describe("Key insights from the source material"),
});

export const extractKeyInsightsNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { sourceMaterial, feedback } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = extractKeyInsightsPrompts(sourceMaterial);

  const systemMessage = feedback
    ? extractKeyInsightsWithFeedbackInstructions(feedback)
    : extractKeyInsightInstructions;

  const { topics, quotes, insights } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessage }),
    new HumanMessage({ content: prompt }),
  ]);

  return { topics, quotes, insights };
};
