export enum Nodes {
  WELCOME_MESSAGE = "WELCOME_MESSAGE",
  AUDIO_INPUT = "AUDIO_INPUT",
  AUDIO_OUTPUT = "AUDIO_OUTPUT",
  PARSE_INTENT = "PARSE_INTENT",
  ITEM_SELECTION = "ITEM_SELECTION",
  CHECK_INVENTORY = "CHECK_INVENTORY",
  REVIEW_ORDER = "REVIEW_ORDER",
  MODIFY_ORDER = "MODIFY_ORDER",
  CONFIRM_ORDER = "CONFIRM_ORDER",
}

export const getWelcomeMessage = (businessName: string | undefined) => {
  return `Welcome to ${
    businessName ?? "Demo Store"
  }! How can I assist you today?`;
};
