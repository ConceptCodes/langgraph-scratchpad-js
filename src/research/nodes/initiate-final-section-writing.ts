import { Send } from "@langchain/langgraph";
import type { AgentStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const initiateFinalSectionWritingNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { sections, reportSectionsFromResearch, topic } = state;
  return sections
    .filter((s) => !s.research)
    .map(
      (s) =>
        new Send(Nodes.WRITE_FINAL_SECTIONS, {
          topic,
          section: s,
          reportSectionsFromResearch,
        })
    );
};
