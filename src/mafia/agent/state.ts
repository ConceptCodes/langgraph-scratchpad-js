import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

import type { Player } from "../helpers/types";

export const InputStateAnnotation = Annotation.Root({
  mafiaCount: Annotation<number>({
    reducer: (a, b) => b ?? a,
    default: () => 0,
  }),
});

export const OutputStateAnnotation = Annotation.Root({
  winner: Annotation<"town" | "mafia" | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
});

export const SharedStateAnnotation = Annotation.Root({
  votes: Annotation<Record<string, number>>({
    reducer: (a, b) => ({ ...a, ...b }),
    default: () => ({}),
  }),
  players: Annotation<Player[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  phase: Annotation<"day" | "night">({
    reducer: (a, b) => b ?? a,
    default: () => "day",
  }),
  round: Annotation<number>({
    reducer: (a, b) => b ?? a,
    default: () => 1,
  }),
  publicChat: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  privateChat: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  eliminatedPlayers: Annotation<string[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});

export const DiscussionStateAnnotation = Annotation.Root({
  ...SharedStateAnnotation.spec,

  consensusReached: Annotation<boolean>({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  members: Annotation<Player[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  protectedPlayers: Annotation<string[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  investigatedPlayers: Annotation<{ name: string; role: string }[]>({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),
  turnCounter: Annotation<number>({
    reducer: (a, b) => b ?? a,
    default: () => 0,
  }),
  argumentBank: Annotation<string[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  proposals: Annotation<
    Map<
      string,
      {
        name: string;
        confidence: number;
      }
    >
  >,
  target: Annotation<string | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
});

export const NightStateAnnotation = Annotation.Root({
  ...DiscussionStateAnnotation.spec,
});

export const DayStateAnnotation = Annotation.Root({
  ...DiscussionStateAnnotation.spec,
  ...OutputStateAnnotation.spec,
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...NightStateAnnotation.spec,
  ...DayStateAnnotation.spec,
});
