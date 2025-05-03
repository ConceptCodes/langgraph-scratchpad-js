import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

import type { DraftOrder, Language } from "../helpers/types";

export const ConfigurationAnnotation = Annotation.Root({
  language: Annotation<Language>({
    reducer: (a, b) => b ?? a,
    default: () => "en",
  }),
  timezone: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "UTC",
  }),
  businessName: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),
  upSellEnabled: Annotation<boolean>({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
});

export const OutputStateAnnotation = Annotation.Root({
  draft: Annotation<DraftOrder>({
    reducer: (a, b) => b ?? a,
    default: () => ({
      orderItems: [],
    }),
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...OutputStateAnnotation.spec,

  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),

  prev: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),

  queryResults: Annotation<any[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  completed: Annotation<boolean>({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
});
