import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";

import { llm } from "../helpers/llm";
import { reviewDraftInstructions, reviewDraftPrompt } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { outputSchema } from "../helpers/types";
import { Nodes } from "../helpers/constants";
import { formatDraft } from "../helpers/utils";

export const reviewDraftNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { draft, sectionType } = state;
  const formattedDraft = formatDraft(draft!);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const prompt = reviewDraftPrompt(formattedDraft, sectionType);

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
