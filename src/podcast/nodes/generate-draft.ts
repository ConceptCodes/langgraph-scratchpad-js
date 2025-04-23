import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import {
  generateDraftInstructions,
  generateDraftPrompts,
} from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { scriptSchema } from "../helpers/types";

export const generateDraftNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { sourceMaterial, sectionType, section } = state;

  const structuredLLM = llm.withStructuredOutput(scriptSchema);
  const prompt = generateDraftPrompts(sourceMaterial, sectionType, section!);

  const draft = await structuredLLM.invoke([
    new SystemMessage({ content: generateDraftInstructions }),
    new HumanMessage({ content: prompt }),
  ]);

  return { draft };
};
