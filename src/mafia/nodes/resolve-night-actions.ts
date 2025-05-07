import type { NightStateAnnotation } from "../agent/state";

export const resolveNightActionsNode = (
  state: typeof NightStateAnnotation.State
): typeof NightStateAnnotation.Update => {
  const { target, protectedPlayers } = state;
  const doctorProtected = protectedPlayers.pop();

  console.log("Doctor protected:", doctorProtected);

  if (target != doctorProtected) {
    return {
      eliminatedPlayers: [target!],
      target: null,
    };
  }

  return {};
};
