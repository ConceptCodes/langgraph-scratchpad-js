import { z } from "zod";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { systemMessagePrompt } from "../agent/prompts";

const outputSchema = z.object({});

export const conflictCheckNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages } = state;
  const lastMessage = messages.at(-1)?.content as string;
};
