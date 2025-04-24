import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export const InputStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
});
