import { Command } from "@langchain/langgraph";

import { Nodes } from "../helpers/constants";
import type { DiscussionStateAnnotation } from "../agent/state";

export const checkConsensusNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const { votes, members } = state;

  console.log("[checkConsensusNode] votes:", votes);
  console.log("[checkConsensusNode] members:", members);

  const totalVotes = Object.values(votes).reduce(
    (acc, count) => acc + count,
    0
  );
  const totalPlayers = members.length;
  const allPlayersVoted = totalVotes === totalPlayers;

  console.log("[checkConsensusNode] totalVotes:", totalVotes);
  console.log("[checkConsensusNode] totalPlayers:", totalPlayers);
  console.log("[checkConsensusNode] allPlayersVoted:", allPlayersVoted);

  const voteCounts = Object.values(votes);
  const maxVotes = Math.max(...voteCounts);
  const maxVoteCount = voteCounts.filter((vote) => vote === maxVotes).length;
  const consensusThreshold = Math.ceil(totalPlayers / 2);
  const consensusReached = maxVoteCount >= consensusThreshold;

  console.log("[checkConsensusNode] voteCounts:", voteCounts);
  console.log("[checkConsensusNode] maxVotes:", maxVotes);
  console.log("[checkConsensusNode] maxVoteCount:", maxVoteCount);
  console.log("[checkConsensusNode] consensusThreshold:", consensusThreshold);
  console.log("[checkConsensusNode] consensusReached:", consensusReached);

  if (consensusReached && allPlayersVoted) {
    console.log("[checkConsensusNode] Consensus reached. Moving to RESOLVE_VOTE.");
    return new Command({
      goto: Nodes.RESOLVE_VOTE,
      update: {
        consensusReached: true,
      },
    });
  }
  console.log("[checkConsensusNode] Consensus not reached. Returning to ADD_TO_DISCUSSION.");
  return new Command({
    goto: Nodes.ADD_TO_DISCUSSION,
  });
};
