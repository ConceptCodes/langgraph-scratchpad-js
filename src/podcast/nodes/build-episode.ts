import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { scriptSchema, type Script } from "../helpers/types";
import { formatDraft } from "../helpers/utils";
import {
  buildEpisodeInstructions,
  buildEpisodeInstructionsWithFeedback,
  buildEpisodePrompt,
} from "../agent/prompts";

export const buildEpisodeNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const {
    completedSections,
    outline: { title, description, desiredTone },
    feedback,
  } = state;

  if (!completedSections || completedSections.length === 0) {
    throw new Error("No sections available to build the episode.");
  }
  const structuredLLM = llm.withStructuredOutput(scriptSchema);

  const sectionsText = completedSections
    .map((section) => formatDraft(section))
    .join("\n\n---\n\n");

  const prompt = buildEpisodePrompt(
    sectionsText,
    title,
    description,
    desiredTone
  );

  const systemMessage = feedback
    ? buildEpisodeInstructionsWithFeedback(feedback)
    : buildEpisodeInstructions(title);

  const { script: combinedScript } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessage }),
    new HumanMessage({ content: prompt }),
  ]);

  const script: Script = { script: combinedScript };

  return {
    script,
    title,
    description,
  };
};
