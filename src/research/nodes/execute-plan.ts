import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { sections } = state;

  return sections.map((section) => {
    new Send(Nodes.EXECUTE_PLAN, { section });
  });
};
