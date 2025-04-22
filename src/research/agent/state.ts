import { Annotation } from "@langchain/langgraph";

import type { Section } from "../helpers/types";

export const InputStateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  // researchLoopCount: Annotation<number>({
  //   reducer: (a, b) => b ?? a,
  //   default: () => 0,
  // }),
});

export const OutputStateAnnotation = Annotation.Root({
  finalReport: Annotation<string>,
});

const SharedStateAnnotation = Annotation.Root({
  reportSectionsFromResearch: Annotation<string>,
});

export const SectionOutputStateAnnotation = Annotation.Root({
  completedSections: Annotation<Section[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,

  sections: Annotation<Section[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),

  ...OutputStateAnnotation.spec,
  ...SectionOutputStateAnnotation.spec,
  ...SharedStateAnnotation.spec,
});

export const SectionStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,

  section: Annotation<Section>,
  searchIterations: Annotation<number>({
    reducer: (a, b) => a + b,
    default: () => 0,
  }),
  searchQueries: Annotation<string[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  source: Annotation<string>,

  ...SectionOutputStateAnnotation.spec,
  ...SharedStateAnnotation.spec,
});
