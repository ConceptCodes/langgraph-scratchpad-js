import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import { listenAndTranscribe } from "../helpers/utils";
import { Nodes } from "../helpers/constants";
import type { AgentStateAnnotation } from "../agent/state";

export const audioInputNode = async (_: typeof AgentStateAnnotation.State) => {
  let transcript = await listenAndTranscribe(); //TODO: make this configurable

  while (transcript.trim() === "") {
    transcript = await listenAndTranscribe();
  }

  return new Command({
    goto: Nodes.PARSE_INTENT,
    update: {
      messages: [new HumanMessage(transcript)],
    },
  });
};
