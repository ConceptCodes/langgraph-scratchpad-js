import { Command } from "@langchain/langgraph";

import { Nodes } from "../helpers/constants";
import type { DiscussionStateAnnotation } from "../agent/state";

export const checkConsensusNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const { votes, members } = state;

  const totalVotes = Object.values(votes).reduce(
    (acc, count) => acc + count,
    0
  );
  const totalPlayers = members.length;
  const allPlayersVoted = totalVotes === totalPlayers;

  const voteCounts = Object.values(votes);
  const maxVotes = Math.max(...voteCounts);
  const maxVoteCount = voteCounts.filter((vote) => vote === maxVotes).length;
  const consensusThreshold = Math.ceil(totalPlayers / 2);
  const consensusReached = maxVoteCount >= consensusThreshold;

  if (consensusReached && allPlayersVoted) {
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
