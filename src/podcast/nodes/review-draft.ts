import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";

import { llm } from "../helpers/llm";
import { reviewDraftInstructions, reviewDraftPrompts } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { outputSchema } from "../helpers/types";
import { Nodes } from "../helpers/constants";

export const reviewDraftNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { draft, sectionType } = state;
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const prompt = reviewDraftPrompts(draft!, sectionType);

  const { grade, feedback } = await structuredLLM.invoke([
    new SystemMessage({ content: reviewDraftInstructions }),
    new HumanMessage({ content: prompt }),
  ]);

  switch (grade) {
    case "pass":
      return new Command({
        goto: END,
        update: {
          completedSections: [draft],
        },
      });
    case "fail":
      return new Command({
        goto: Nodes.GENERATE_DRAFT,
        update: { feedback },
      });
  }
};
