import type { AgentStateAnnotation } from "../agent/state";

export const startDiscussionNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { players, phase, publicChat, mafiaChat } = state;
  const mafia = players.filter(
    (player) => player.alive && player.role === "mafia"
  );
  const villagers = players.filter((player) => player.alive);

  switch (phase) {
    case "day":
      console.log("Starting discussion", mafia);
      return {
        members: villagers,
        chatLog: publicChat,
      };
    case "night":
      console.log("Starting discussion", mafia);
      return {
        members: mafia,
        chatLog: mafiaChat,
      };
  }
};
