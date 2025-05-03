import { Command } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import {
  coverageCheckInstructions,
  coverageCheckPrompt,
} from "../agent/prompts";
import { Nodes } from "../helpers/constants";
import { outputSchema } from "../helpers/types";

export const coverageCheckNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { topics, quotes, insights, sourceMaterial } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = coverageCheckPrompt(topics, quotes, insights, sourceMaterial);

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
