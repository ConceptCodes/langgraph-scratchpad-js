import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = (state: typeof AgentStateAnnotation.State) => {
  const { outline } = state
  return [
    new Send(Nodes.BUILD_SECTIONS, { sectionType: "intro", section: outline.intro }),
    new Send(Nodes.BUILD_SECTIONS, { sectionType: "main", section: outline.mainSegments }),
    new Send(Nodes.BUILD_SECTIONS, { sectionType: "summary", section: outline.summary }),
    new Send(Nodes.BUILD_SECTIONS, { sectionType: "outro", section: outline.outro }),
  ];
};
