import type { AgentStateAnnotation } from "../agent/state";

export const startDiscussionNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { players, phase, eliminatedPlayers } = state;

  const stillAlivePlayers = players.filter(
    (player) => !eliminatedPlayers.includes(player.name)
  );

  const mafia = stillAlivePlayers.filter((player) => player.role === "mafia");

  switch (phase) {
    case "day":
      return {
        members: stillAlivePlayers,
      };
    case "night":
      return {
        members: mafia,
      };
  }
};
