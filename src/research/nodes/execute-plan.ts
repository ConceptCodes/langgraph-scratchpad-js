import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = (state: typeof AgentStateAnnotation.State) => {
  const { sections, topic } = state;
  return sections.map(
    (section) => new Send(Nodes.GENERATE_QUERY, { section, topic })
  );
};
