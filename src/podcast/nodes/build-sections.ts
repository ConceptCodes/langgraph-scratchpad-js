import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = (state: typeof AgentStateAnnotation.State) => {
  const { outline } = state;

  console.log("Intro:", outline.intro);
  console.log("Main Segments:", outline.mainSegments);
  console.log("Summary:", outline.summary);
  console.log("Outro:", outline.outro);

  return [
    new Send(Nodes.BUILD_SECTIONS, {
      sectionType: "intro",
      section: outline.intro,
    }),
    new Send(Nodes.BUILD_SECTIONS, {
      sectionType: "main",
      section: outline.mainSegments,
    }),
    new Send(Nodes.BUILD_SECTIONS, {
      sectionType: "summary",
      section: outline.summary,
    }),
    new Send(Nodes.BUILD_SECTIONS, {
      sectionType: "outro",
      section: outline.outro,
    }),
  ];
};
