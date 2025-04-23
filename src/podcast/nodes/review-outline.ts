import z from "zod";
import { Command } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import {
  reviewOutlineInstructions,
  reviewOutlinePrompts,
} from "../agent/prompts";
import { Nodes } from "../helpers/constants";
import { outputSchema } from "../helpers/types";

export const reviewOutlineNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { outline } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = reviewOutlinePrompts(JSON.stringify(outline, null, 2));

  const { grade, feedback } = await structuredLLM.invoke([
    new SystemMessage({ content: reviewOutlineInstructions }),
    new HumanMessage({ content: prompt }),
  ]);

  switch (grade) {
    case "pass":
      return new Command({
        goto: Nodes.BUILD_SECTIONS,
        update: { feedback: null },
      });
    case "fail":
      return new Command({
        goto: Nodes.GENERATE_OUTLINE,
        update: { feedback },
      });
  }
};
