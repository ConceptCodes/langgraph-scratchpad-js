import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import {
  generateDraftInstructions,
  generateDraftInstructionsWithFeedback,
  generateDraftPrompts,
} from "../agent/prompts";
import type {
  AgentStateAnnotation,
  ConfigurationStateAnnotation,
} from "../agent/state";
import { scriptSchema } from "../helpers/types";
import type { RunnableConfig } from "@langchain/core/runnables";

export const generateDraftNode = async (
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationStateAnnotation.State>
): Promise<typeof AgentStateAnnotation.Update> => {
  const { sourceMaterial, sectionType, section, feedback } = state;
  const lang = config.configurable?.podcastLanguage ?? "en";
  const title = config.configurable?.podcastTitle ?? "Podcast";

  const structuredLLM = llm.withStructuredOutput(scriptSchema);
  const prompt = generateDraftPrompts(
    title,
    lang,
    sourceMaterial,
    sectionType,
    section!
  );

  const systemMessage = feedback
    ? generateDraftInstructionsWithFeedback(
        feedback,
        title,
        lang,
        sourceMaterial,
        section!
      )
    : generateDraftInstructions;

  const draft = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessage }),
    new HumanMessage({ content: prompt }),
  ]);

  return { draft };
};
