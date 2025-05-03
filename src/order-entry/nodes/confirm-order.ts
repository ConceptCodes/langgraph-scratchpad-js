import { z } from "zod";
import type { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

import { confirmationPrompt } from "../agent/prompts";
import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  signOffMessage: z.string(),
});

export const confirmOrderNode = async (
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const { draft } = state;
  const businessName = config.configurable?.businessName;

  const prompt = confirmationPrompt(draft, businessName);
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { signOffMessage } = await structuredLLM.invoke([
    new HumanMessage(prompt),
  ]);

  return {
    messages: [new AIMessage(signOffMessage)],
    completed: true,
  };
};
