import type { DayStateAnnotation } from "../agent/state";

export const checkWinnerNode = async (
  state: typeof DayStateAnnotation.State
): Promise<typeof DayStateAnnotation.Update> => {
  const { players, eliminatedPlayers } = state;

  const alivePlayers = players.filter(
    (player) => !eliminatedPlayers.includes(player.name)
  );
  const mafiaCount = alivePlayers.filter(
    (player) => player.role === "mafia"
  ).length;
  const townCount = alivePlayers.filter(
    (player) => player.role !== "mafia"
  ).length;

  if (mafiaCount === 0) return { winner: "town" };
  if (mafiaCount >= townCount) return { winner: "mafia" };

  return {};
};
