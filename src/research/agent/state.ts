import { Annotation } from "@langchain/langgraph";

import type { Section } from "../helpers/types";

export const AgentStateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  sections: Annotation<Section[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  finalReport: Annotation<string>,
});

export type SectionState = {
  section: Section;
  researchLoopCount: number;
  searchQuery: string;
  webResearchResults: string[];
};
