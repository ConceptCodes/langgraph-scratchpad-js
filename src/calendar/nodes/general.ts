import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { generalQuestionPrompt, systemMessagePrompt } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

const outputSchema = z.object({
  answer: z.string().describe("The answer to the user's question"),
});

export const generalNode = async (state: typeof AgentStateAnnotation.State) => {
  const parsedMessages = state.messages.map(
    (message) => message.content as string
  );

  const prompt = generalQuestionPrompt(parsedMessages);

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const { answer } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt() }),
    new HumanMessage({ content: prompt }),
  ]);

  return {
    messages: [new AIMessage({ content: answer })],
  };
};
