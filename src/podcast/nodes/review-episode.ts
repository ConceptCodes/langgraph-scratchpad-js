import { Command } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import {
  reviewEpisodeInstructions,
  reviewEpisodePrompt,
} from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { formatDraft } from "../helpers/utils";
import { outputSchema } from "../helpers/types";
import { Nodes } from "../helpers/constants";

export const reviewEpisodeNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { script } = state;

  const draft = formatDraft(script!);
  const prompt = reviewEpisodePrompt(draft);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { grade, feedback } = await structuredLLM.invoke([
    new SystemMessage({
      content: reviewEpisodeInstructions,
    }),
    new HumanMessage({ content: prompt }),
  ]);

  switch (grade) {
    case "pass":
      return new Command({
        goto: Nodes.GENERATE_AUDIO,
      });
    case "fail":
      return new Command({
        goto: Nodes.BUILD_EPISODE,
        update: {
          feedback,
        },
      });
  }
};
