import type { DiscussionStateAnnotation } from "../agent/state";

export const resolveVotesNode = async (
  state: typeof DiscussionStateAnnotation.State
) => {
  const { votes } = state;

  const maxVotes = Math.max(...Object.values(votes));
  const targetPlayer = Object.keys(votes).find(
    (player) => votes[player] === maxVotes
  );

  console.log("Target player for elimination:", targetPlayer);

  return {
    target: targetPlayer,
    votes: {},
  };
};
