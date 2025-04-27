import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import {
  describeNightPhasePrompt,
  introduceGamePrompt,
} from "../agent/prompts";
import { Nodes } from "../helpers/constants";

export const narratorNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<Command<Nodes.DAY_PHASE | Nodes.NIGHT_PHASE>> => {
  const { players, round, phase, eliminatedPlayers, protectedPlayers, winner } =
    state;

  if (winner) {
    return new Command({
      goto: END,
    });
  }

  const lastEliminatedPlayer = eliminatedPlayers[eliminatedPlayers.length - 1];
  const lastProtectedPlayer = protectedPlayers[protectedPlayers.length - 1];

  const playerNamesAndBios = players.map((player) => ({
    name: player.name,
    bio: player.bio,
  }));

  switch (phase) {
    case "day": {
      if (round === 1) {
        const prompt = introduceGamePrompt(playerNamesAndBios);
        const message = await llm.invoke([new HumanMessage(prompt)]);
        return new Command({
          goto: Nodes.NIGHT_PHASE,
          update: {
            publicChat: [new AIMessage(message)],
            phase: "night",
          },
        });
      }

      const prompt = describeNightPhasePrompt(
        lastEliminatedPlayer!,
        lastProtectedPlayer!
      );
      const message = await llm.invoke([new HumanMessage(prompt)]);
      return new Command({
        goto: Nodes.DAY_PHASE,
        update: {
          publicChat: [new AIMessage(message)],
          privateChat: [new AIMessage(message)],
          phase: "day",
        },
      });
    }
    case "night": {
      return new Command({
        goto: Nodes.DAY_PHASE,
        update: {
          phase: "day",
        },
      });
    }
  }
};
