import { Annotation } from "@langchain/langgraph";
import type {
  PodcastOutline,
  Script,
  Sections,
  SectionType,
} from "../helpers/types";

export const InputStateAnnotation = Annotation.Root({
  sourceMaterial: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
});

export const OutputStateAnnotation = Annotation.Root({
  script: Annotation<Script | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  title: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
  description: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
  audioFilePath: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,

  topics: Annotation<string[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  quotes: Annotation<string[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  insights: Annotation<string[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  feedback: Annotation<string | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  outline: Annotation<PodcastOutline>,

  draft: Annotation<Script | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),

  section: Annotation<Sections | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  sectionType: Annotation<SectionType>({
    reducer: (a, b) => b ?? a,
    default: () => "intro",
  }),
  completedSections: Annotation<Script[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),

  ...OutputStateAnnotation.spec,
});
