import { Command } from "@langchain/langgraph";
import type { DiscussionStateAnnotation } from "../agent/state";
import { Nodes } from "../helpers/constants";

export const checkConsensusNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const { votes } = state;
  let consensusReached = false;

  const voteCounts = Object.entries(votes).reduce((acc, [player, count]) => {
    acc[player] = (acc[player] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const maxVotes = Math.max(...Object.values(voteCounts));

  const playersWithMaxVotes = Object.entries(voteCounts)
    .filter(([_, count]) => count === maxVotes)
    .map(([player]) => player);

  if (consensusReached) {
    return new Command({
      goto: Nodes.RESOLVE_VOTE,
      update: {
        consensusReached: true,
      },
    });
  }
  return new Command({
    goto: Nodes.ADD_TO_DISCUSSION,
  });
};
