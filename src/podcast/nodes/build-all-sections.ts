import { Send } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const executePlanNode = (state: typeof AgentStateAnnotation.State) => {
  const { outline, sourceMaterial, topics, quotes, insights  } = state;
  const base = {
    sourceMaterial, topics, quotes, insights
  }

  const introSend = new Send(Nodes.BUILD_SECTION, {
    sectionType: "intro",
    section: outline.intro,
    ...base
  });

  const mainSegmentSends = outline.mainSegments.map(
    (segment) =>
      new Send(Nodes.BUILD_SECTION, {
        sectionType: "main",
        section: segment,
        ...base
      })
  );

  const summarySend = new Send(Nodes.BUILD_SECTION, {
    sectionType: "summary",
    section: outline.summary,
    ...base
  });

  const outroSend = new Send(Nodes.BUILD_SECTION, {
    sectionType: "outro",
    section: outline.outro,
    ...base
  });

  return [introSend, ...mainSegmentSends, summarySend, outroSend];
};
