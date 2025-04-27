import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import {
  describeNightPhasePrompt,
  introduceGamePrompt,
} from "../agent/prompts";
import { Nodes } from "../helpers/constants";

export const narratorNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<Command<Nodes.DAY_PHASE | Nodes.NIGHT_PHASE>> => {
  const { players, round, phase, eliminatedPlayers, protectedPlayers } = state;

  const lastEliminatedPlayer = eliminatedPlayers[eliminatedPlayers.length - 1];
  const lastProtectedPlayer = protectedPlayers[protectedPlayers.length - 1];

  switch (phase) {
    case "day": {
      if (round === 1) {
        const playerNames = players.map((player) => player.name);
        const prompt = introduceGamePrompt(playerNames);
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
