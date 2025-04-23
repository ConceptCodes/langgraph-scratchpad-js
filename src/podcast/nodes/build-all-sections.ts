import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = (state: typeof AgentStateAnnotation.State) => {
  const { outline } = state;

  const introSend = new Send(Nodes.BUILD_SECTION, {
    sectionType: "intro",
    section: outline.intro,
  });

  const mainSegmentSends = outline.mainSegments.map(
    (segment) =>
      new Send(Nodes.BUILD_SECTION, {
        sectionType: "main",
        section: segment,
      })
  );

  const summarySend = new Send(Nodes.BUILD_SECTION, {
    sectionType: "summary",
    section: outline.summary,
  });

  const outroSend = new Send(Nodes.BUILD_SECTION, {
    sectionType: "outro",
    section: outline.outro,
  });

  return [introSend, ...mainSegmentSends, summarySend, outroSend];
};
