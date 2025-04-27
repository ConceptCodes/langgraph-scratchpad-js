import { z } from "zod";
import { Command } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { reviewStepsPrompt } from "../agent/prompts";
import { Nodes } from "../helpers/constants";
import { HumanMessage } from "@langchain/core/messages";

const outputSchema = z.object({
  grade: z.enum(["pass", "fail"]).describe("Grade of the plan"),
  feedback: z
    .string()
    .optional()
    .describe("Feedback on the steps, only needed if the grade is 'fail'"),
});

export const reviewPlanNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { goal, steps } = state;
  const prompt = reviewStepsPrompt(goal, steps);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { grade, feedback } = await structuredLLM.invoke([
    new HumanMessage({ content: prompt }),
  ]);

  switch (grade) {
    case "pass":
      return new Command({
        goto: Nodes.ASSIGN_TASK,
      });
    case "fail":
      return new Command({
        goto: Nodes.GENERATE_PLAN,
        update: { feedback },
      });
  }
};
