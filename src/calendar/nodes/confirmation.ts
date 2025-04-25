import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { Command, END, interrupt } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { systemMessagePrompt, userConfirmationPrompt } from "../agent/prompts";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe("The generated confirmation message based on the user request"),
});

export const confirmationNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages, query } = state;
  const lastMessage = messages.at(-1)?.content as string;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = userConfirmationPrompt(query, lastMessage as string);

  const { confirmationMessage } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  const confirmation: string = interrupt(confirmationMessage);

  if (confirmation.toLowerCase() !== "yes") {
    return new Command({
      goto: END,
      update: {
        messages: [
          new AIMessage({
            content: "Calendar modification cancelled.",
          }),
        ],
      },
    });
  } else {
    return new Command({
      goto: Nodes.EXECUTE_QUERY,
    });
  }
};
