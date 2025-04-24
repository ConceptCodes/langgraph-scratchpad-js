import {
  SystemMessage,
  ToolMessage,
  type BaseMessageLike,
} from "@langchain/core/messages";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { systemPrompt } from "../agent/prompts";

export const callModelNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const modelMessages = [];

  for (let i = state.messages.length - 1; i >= 0; i--) {
    modelMessages.push(state.messages[i]);
    if (modelMessages.length >= 5) {
      const lastMessage = modelMessages[modelMessages.length - 1];
      if (!lastMessage || !ToolMessage.isInstance(lastMessage)) {
        break;
      }
    }
  }
  modelMessages.reverse();

  const response = await llm.invoke([
    new SystemMessage({ content: systemPrompt }),
    ...(modelMessages as BaseMessageLike[]), // <-- Problem likely originates here
  ]);
  return { messages: [response] };
};
