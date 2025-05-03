import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";

import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";
import { llm } from "../helpers/llm";
import { reviewOrderPrompt } from "../agent/prompts";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  statement: z.string(),
});

export const reviewOrderNode = async (
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const { draft } = state;
  const upSellEnabled = config.configurable?.upSellEnabled ?? false;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = reviewOrderPrompt(draft, upSellEnabled);
  const { statement } = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return new Command({
    goto: Nodes.AUDIO_OUTPUT,
    update: {
      messages: [new AIMessage(statement)],
    },
  });
};
