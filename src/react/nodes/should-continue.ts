import { END } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const shouldContinue = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof END | typeof Nodes.TOOL> => {
  const lastMessage = state.messages.at(-1) as AIMessage;

  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return END;
  }

  return Nodes.TOOL;
};
