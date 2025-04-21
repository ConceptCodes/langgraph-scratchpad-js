import type { AgentStateAnnotation } from "../agent/state";

export const compileFinalSectionsNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { sections, completedSections } = state;

  const completedContentMap = new Map<string, string>();
  for (const completedSection of completedSections) {
    completedContentMap.set(completedSection.title, completedSection.content!);
  }

  for (const section of sections) {
    const completedContent = completedContentMap.get(section.title);
    if (completedContent !== undefined) {
      section.content = completedContent;
    }
  }

  const allSectionsContent = sections
    .map((section) => section.content)
    .join("\n\n");

  return { finalReport: allSectionsContent };
};
