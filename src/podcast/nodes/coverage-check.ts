import z from "zod";
import { Command } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import {
  coverageCheckInstructions,
  coverageCheckPrompts,
} from "../agent/prompts";
import { Nodes } from "../helpers/constants";
import { outputSchema } from "../helpers/types";

export const coverageCheckNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { topics, quotes, insights } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = coverageCheckPrompts(topics, quotes, insights);

  const { grade, feedback } = await structuredLLM.invoke([
    new SystemMessage({ content: coverageCheckInstructions }),
    new HumanMessage({ content: prompt }),
  ]);

  switch (grade) {
    case "pass":
      return new Command({
        goto: Nodes.GENERATE_OUTLINE,
        update: {
          feedback: null,
        },
      });
    case "fail":
      return new Command({
        goto: Nodes.EXTRACT_KEY_INSIGHTS,
        update: { feedback },
      });
  }
};
