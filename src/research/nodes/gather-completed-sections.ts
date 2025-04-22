import type { AgentStateAnnotation } from "../agent/state";
import { formatSections } from "../helpers/utils";

export const gatherCompletedSectionsNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { completedSections } = state;

  const reportSectionsFromResearch = formatSections(completedSections);

  return { reportSectionsFromResearch };
};
