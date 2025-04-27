import { Send } from "@langchain/langgraph";
import { faker } from "@faker-js/faker";

import type { AgentStateAnnotation } from "../agent/state";
import type { Player } from "../helpers/types";
import { Nodes } from "../helpers/constants";

export const initPlayersNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { mafiaCount } = state;
  const villagerCount = mafiaCount * 2;

  const base: Player[] = [
    {
      role: "detective",
      name: faker.person.firstName(),
      bio: null,
    },
    {
      role: "doctor",
      name: faker.person.firstName(),
      bio: null,
    },
  ];

  const dynamicPlayers: Player[] = Array.from(
    { length: mafiaCount + villagerCount },
    (_, i) =>
      ({
        role: i < mafiaCount ? "mafia" : "town",
        alive: true,
        name: faker.person.firstName(),
        bio: null,
      } as Player)
  );

  const allPlayers = base.concat(dynamicPlayers);

  const uniqueNames = new Set();
  allPlayers.forEach((player) => {
    while (uniqueNames.has(player.name)) {
      player.name = faker.person.firstName();
    }
    uniqueNames.add(player.name);
  });

  return allPlayers.map((player) => {
    return new Send(Nodes.INIT_PLAYERS, { players: [player] });
  });
};
