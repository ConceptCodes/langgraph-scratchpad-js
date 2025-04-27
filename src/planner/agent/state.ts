import { Annotation, END } from "@langchain/langgraph";

export const ConfigurationStateAnnotation = Annotation.Root({
  planningModel: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
  taskModel: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
});

export const InputStateAnnotation = Annotation.Root({
  goal: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
});

export const OutputStateAnnotation = Annotation.Root({
  output: Annotation<any>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...OutputStateAnnotation.spec,

  steps: Annotation<string[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  feedback: Annotation<string | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  next: Annotation<string>({
    reducer: (a, b) => b ?? a ?? END,
    default: () => "",
  }),
  currentTask: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
});
