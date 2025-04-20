import { Annotation } from "@langchain/langgraph";

import type { Section } from "../helpers/types";

export const AgentStateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  sections: Annotation<Section[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});

export const SectionStateAnnotation = Annotation.Root({
  section: Annotation<Section>,
  researchLoopCount: Annotation<number>,
  searchQuery: Annotation<string>,
  webResearchResults: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
});
