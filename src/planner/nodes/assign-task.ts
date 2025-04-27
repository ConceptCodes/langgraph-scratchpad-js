import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";
import { llm } from "../helpers/llm";

const options = [Nodes.WEB_SEARCH, Nodes.SQL_SEARCH] as const;

export const outputSchema = z.object({
  next: z.enum(options),
});

export const assignTaskNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { steps } = state;
  const currentTask = steps.shift();

  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const prompt = `You are an agent that is given a task. Your task is to ${currentTask}. Please assign the task to the appropriate node.
  The options are: ${options.join(
    ", "
  )}. Please respond with the name of the node that should execute the task.`;

  const { next } = await structuredLLM.invoke([
    new HumanMessage({ content: prompt }),
  ]);

  return new Command({
    goto: Nodes.EXECUTE_TASK,
    update: { currentTask, next },
  });
};
