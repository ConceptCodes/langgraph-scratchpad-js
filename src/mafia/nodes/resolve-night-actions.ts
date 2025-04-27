import type { NightStateAnnotation } from "../agent/state";

export const resolveNightActionsNode = (
  state: typeof NightStateAnnotation.State
): typeof NightStateAnnotation.Update => {
  const { target, protectedPlayers } = state;
  const doctorProtected = protectedPlayers.pop();

  if (target != doctorProtected) {
    return {
      eliminatedPlayers: [target!],
    };
  }

  return {};
};
