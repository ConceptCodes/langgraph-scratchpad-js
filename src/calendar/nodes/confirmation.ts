import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { Command, END, interrupt } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import {
  systemMessagePrompt,
  userConfirmationPrompt,
  userConfirmationSystemPrompt,
} from "../agent/prompts";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe("The generated confirmation message based on the user request"),
});

const confirmationOutputSchema = z.object({
  confirmed: z.boolean().describe("Whether the user confirmed the action"),
});

export const confirmationNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages, query, confirmation } = state;

  if (confirmation) {
    return new Command({
      goto: Nodes.EXECUTE_QUERY,
    });
  }

  const lastMessage = messages.at(-1)?.content as string;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = userConfirmationPrompt(query, lastMessage as string);

  const { confirmationMessage } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  const response: string = interrupt(confirmationMessage);

  const confirmationStructuredLLM = llm.withStructuredOutput(
    confirmationOutputSchema
  );
  const { confirmed } = await confirmationStructuredLLM.invoke([
    new SystemMessage({
      content: userConfirmationSystemPrompt(confirmationMessage),
    }),
    new HumanMessage({ content: `here is the users response: ${response}` }),
  ]);

  if (!confirmed) {
    return new Command({
      goto: END,
      update: {
        messages: [
          new AIMessage({
            content: "Calendar modification cancelled by user.",
          }),
        ],
      },
    });
  }

  return new Command({
    goto: Nodes.EXECUTE_QUERY,
    update: {
      confirmation: true,
    },
  });
};
