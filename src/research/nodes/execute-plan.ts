import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = (state: typeof AgentStateAnnotation.State) => {

  console.log(
    state.sections.map((section) => section.title).join("\n")
  )

  return state.sections
    .filter((section) => !!section.title)
    .map((section) => new Send(Nodes.GENERATE_QUERY, { section }));
};
