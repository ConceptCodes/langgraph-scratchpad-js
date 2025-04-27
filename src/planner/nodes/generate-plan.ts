import { z } from "zod";
import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import {
  generatePlanPrompt,
  generatePlanWithFeedbackPrompt,
} from "../agent/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { MAX_NUM_STEPS } from "../helpers/constants";

const outputSchema = z.object({
  steps: z.string().array().max(MAX_NUM_STEPS).describe("List of steps to take"),
});

export const generatePlanNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { goal, feedback } = state;
  const prompt = feedback
    ? generatePlanWithFeedbackPrompt(goal, feedback)
    : generatePlanPrompt(goal);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const result = await structuredLLM.invoke([
    new HumanMessage({ content: prompt }),
  ]);

  return { steps: result.steps };
};
