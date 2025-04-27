import type {
  AgentStateAnnotation,
  DiscussionStateAnnotation,
} from "../agent/state";

export const endDiscussionNode = async (
  state: typeof DiscussionStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { phase, chatLog } = state;

  switch (phase) {
    case "day":
      return {
        mafiaChat: chatLog,
      };
    case "night":
      return {
        publicChat: chatLog,
      };
  }
};
