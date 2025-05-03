import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import {
  generateOutlineInstructions,
  generateOutlineInstructionsWithFeedback,
  generateOutlinePrompt,
} from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { podcastOutlineSchema } from "../helpers/types";
import { PODCAST_OUTLINE } from "../helpers/constants";

export const generateOutlineNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { topics, quotes, insights, sourceMaterial, feedback } = state;

  const structuredLLM = llm.withStructuredOutput(podcastOutlineSchema);
  const systemMessage = feedback
    ? generateOutlineInstructionsWithFeedback(
        feedback,
        PODCAST_OUTLINE,
        topics,
        quotes,
        insights
      )
    : generateOutlineInstructions(PODCAST_OUTLINE, topics, quotes, insights);
    
  const prompt = generateOutlinePrompt(sourceMaterial);

  const outline = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessage }),
    new HumanMessage({ content: prompt }),
  ]);

  return { outline };
};
