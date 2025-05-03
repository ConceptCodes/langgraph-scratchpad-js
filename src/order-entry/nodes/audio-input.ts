import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import { listenAndTranscribe } from "../helpers/utils";
import { Nodes } from "../helpers/constants";
import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";
import type { RunnableConfig } from "@langchain/core/runnables";

export const audioInputNode = async (
  _: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const language = config.configurable?.language || "en";
  const transcript = await listenAndTranscribe(language);

  return new Command({
    goto: Nodes.PARSE_INTENT,
    update: {
      messages: [new HumanMessage(transcript)],
    },
  });
};
