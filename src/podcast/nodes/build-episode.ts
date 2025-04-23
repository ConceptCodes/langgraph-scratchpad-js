import type { AgentStateAnnotation } from "../agent/state";

export const buildEpisodeNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const {
    completedSections,
    outline: { title, description },
  } = state;

  const finalScript = completedSections.map((section) => section.script).flat();

  return {
    script: { script: finalScript },
    title,
    description,
  };
};
