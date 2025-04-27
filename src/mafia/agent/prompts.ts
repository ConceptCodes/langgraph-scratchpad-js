export const createPersonalityPrompt = (name: string) => `
Create a detailed and imaginative character bio for a mafia game player named ${name}. 
Describe their background, personality traits, motivations, and any quirks or habits that make them unique. 
Make the description vivid and engaging to help bring the character to life in the game.
Use the following format:
- Background: (e.g., where they grew up, their family, education, etc.)
- Personality Traits: (e.g., introverted, extroverted, analytical, etc.)
- Motivations: (e.g., why they are playing the game, what they hope to achieve, etc.)
- Quirks or Habits: (e.g., any unique behaviors or traits that make them stand out)
`;

export const introduceGamePrompt = (players: string[]) => `
You are the narrator of a mafia game.
You will introduce the game to the players.
You will introduce the players to each other.

You will introduce the game rules to the players.

Here are the players:
${players.map((player) => `- ${player}`).join("\n")}

Here are the game rules:
- The game is played in two phases: day and night.
- During the night phase, the mafia players will choose a player to eliminate
- During the day phase, all players will discuss and vote to eliminate a player.
- The game ends when either the mafia players are eliminated or the town players are outnumbered by the mafia players.
- The mafia players win if they outnumber the town players.
- The town players win if they eliminate all the mafia players.
- The detective can investigate one player each night to determine if they are mafia or town.
- The doctor can save one player each night to prevent them
`;

export const describeNightPhasePrompt = (
  eliminatedPlayer: string,
  protectedPlayer: string
) => `
You are the narrator of a mafia game.
You will describe the night phase to the players based on the following events:

- The mafia players have chosen to eliminate: ${eliminatedPlayer}.
- The doctor has chosen to protect: ${protectedPlayer}.

Ensure to keep the details vague and mysterious, as the players will not know who the mafia players are or who the doctor has protected.
Try to create a sense of suspense and intrigue in your description. Don't just state the events, but narrate them in a way that engages the players and makes them feel like they are part of the story.
`;

export const suggestPlayerForElimination = (
  name: string,
  bio: string,
  role: string,
  players: string[],
  chatHistory: string[]
) => `
Your name is ${name} and you are a player in a mafia game with the role: ${role}.

Here is your character bio:
${bio}

You are discussing with the other players who to eliminate.
Here are the players:
${players.map((player) => `- ${player}`).join("\n")}

Here is the chat history:
${chatHistory.map((message) => `- ${message}`).join("\n")}

You are trying to convince the other players to eliminate one of the players.
`;

export const respondToDiscussionPrompt = (
  name: string,
  bio: string,
  role: string,
  chatHistory: string[]
) => `
Your name is ${name} and you are a player in a mafia game with the role: ${role}.

Here is your character bio:
${bio}

You are discussing with the other players about the last accusation made in the chat.

Here is the chat history:
${chatHistory.map((message) => `- ${message}`).join("\n")}

You are trying to convince the other players to agree or disagree with the last statement made in the chat.
You can choose to agree, disagree, or remain neutral.
You must provide a reason for your reaction.

You can also provide additional context or information that you think is relevant to the discussion.
`;
