import { Command } from "@langchain/langgraph";
import type { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage } from "@langchain/core/messages";

import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";

import { Nodes, getWelcomeMessage } from "../helpers/constants";

export const welcomeMessageNode = async (
  _: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const businessName = config.configurable?.businessName;
  const message = getWelcomeMessage(businessName);

  return new Command({
    goto: Nodes.AUDIO_OUTPUT,
    update: {
      messages: [new AIMessage(message)],
    },
  });
};
