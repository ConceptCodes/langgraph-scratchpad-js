import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { Event } from "../helpers/db";

export const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  query: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
  queryResults: Annotation<Event[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  isValid: Annotation<boolean>({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  metadata: Annotation<Record<string, string>>({
    reducer: (a, b) => ({ ...a, ...b }),
    default: () => ({}),
  }),
});
