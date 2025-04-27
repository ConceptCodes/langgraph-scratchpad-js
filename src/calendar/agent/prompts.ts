import { getAllTableSchemas } from "../helpers/db";
import { Event } from "../helpers/db";

const schema = await getAllTableSchemas();

export const systemMessagePrompt = `You are **Calendar‑GPT**, an assistant that schedules, updates, and reads events with as few questions as possible.

Current date: ${new Date().toISOString().slice(0, 10)}

<DatabaseSchemas>
${JSON.stringify(schema, null, 2)}
</DatabaseSchemas>

General Principles
• Parse natural‑language dates, times, and durations on your own.  
• Infer the event *title* from the action/object clause (“walk my dog”, “read”).  
• Only ask the user something if you cannot *unambiguously* infer it.

𐄂 NEVER hallucinate columns or tables.  
`;

export const gatherRequirementsPrompt = (
  userRequest: string,
  chatHistory: string[] = []
) => `
Task: Decide whether follow‑up questions are needed **before** acting on the user's request to manage calendar events. Your goal is to gather all necessary information with minimal interaction.

<Constraint>
When creating an event (CREATE):
  • title: First, attempt to infer the event title from the user's request (e.g., the action/object phrase like "walk my dog", "meeting with John"). If a title cannot be reasonably and unambiguously inferred, you MUST ask the user for the event title.
  • start_time: This is required. If not provided or inferable, ask for it.
  • end_time or duration: One of these is required unless it's an all-day event. If neither end_time nor duration can be reasonably and unambiguously inferred, you must ask for the end_time.
  • all_day: Assume 'false' unless explicitly stated (e.g., "all-day", "the whole day").

When updating or deleting an event (UPDATE / DELETE):
  • Ask for clarification *only* if the target event cannot be reasonably and unambiguously inferred (e.g., multiple events match the description, no specific ID is given, the date/time is unclear).
</Constraint>

<Hints>
• Infer duration from phrases like “for 1 hour”, “for 90 minutes”.
• Infer start and end times from ranges like “from 5 pm to 6 pm”.
• Interpret relative dates like “Tomorrow” based on the current date provided elsewhere.
• Infer the title from the main action or object described (e.g., "schedule a meeting" -> title: "meeting", "remind me to walk the dog" -> title: "walk the dog"). A good title is usually the verb phrase.
</Hints>

<ChatHistory>
${JSON.stringify(chatHistory, null, 2)}
</ChatHistory>

<UserRequest>${userRequest}</UserRequest>

Based on the <UserRequest>, list any specific follow-up questions needed.
`;

export const isValidSqlQueryPrompt = (
  query: string,
  userRequest: string,
  metadata: Record<string, string>
) => `
You are SQL‑Lint. Your job is to check if the following SQL query is valid SQLite syntax and safe to execute.
Also ensure this sql query is related to the <UserRequest>.

<Query>
${query}
</Query>

<UserRequest>${userRequest}</UserRequest>

<Metadata>
${JSON.stringify(metadata)}
</Metadata>

`;

export const generateSqlQueryPrompt = (
  userRequest: string,
  queryResults: Event[] = [],
  metadata: Record<string, string> = {},
  previousError: string | null = null
) => `
Generate a sqlite query based on the user's request and the context below.

<Constraint>
• **For INSERT statements into the 'events' table, do NOT include the 'id' column. It is generated automatically.**
• Generate only a single, valid SQL statement.
</Constraint>

<UserRequest>${userRequest}</UserRequest>

${
  queryResults.length > 0
    ? `
<LastQueryResults>
${JSON.stringify(queryResults)}
</LastQueryResults>
`
    : ""
}${
  previousError
    ? `
<PreviousError>${previousError}</PreviousError>
`
    : ""
}${
  Object.keys(metadata).length > 0
    ? `
<Metadata>
${JSON.stringify(metadata)}
</Metadata>
`
    : ""
}
SQL Query:
`;

export const generateSummaryPrompt = (
  queryResults: Event[],
  userRequest: string,
  query: string
) => `
Summarize the <Results> for the end‑user in 1‑3 sentences.

<Constraint>
- Do NOT expose raw SQL or internal IDs.
</Constraint>

<UserRequest>${userRequest}</UserRequest>

<ExecutedSQL>${query}</ExecutedSQL>

<Results>
${JSON.stringify(queryResults)}
</Results>
`;

export const generalQuestionPrompt = (
  messages: string[]
) => `Please review the conversation history and respond to the user's latest request below.

<ChatHistory>
${JSON.stringify(messages, null, 2)}
</ChatHistory>

<UserRequest>
${messages[messages.length - 1]}
</UserRequest>

<Instructions>
- If the <UserRequest> is related to managing calendar events or clarifies previous parts of the <ChatHistory>, provide a helpful and concise answer based on the conversation.
- If the <UserRequest> is unrelated to calendar management, politely explain that your focus is on calendar tasks. You could say something like: "My apologies, I can only assist with tasks related to managing your calendar, such as scheduling, updating, or retrieving events. How can I help you with your calendar today?"
- Respond in a natural, conversational tone suitable for an assistant.
- you are allowed to greet the user and ask them how you can help them.
</Instructions>

Assistant Response:
`;

export const routerPrompt = (
  nodes: any,
  userRequest: string,
  chatHistory: string[] = []
) => `
You are a smart router for a calendar assistant. Your job is to select the single most appropriate node from the list below to handle the user's request.

<Nodes>
${nodes.map((n: string) => `- ${n}`).join("\n")}
</Nodes>

<Constraint>
- Only use the "gather requirements" node if the request is related to creating, listing, updating, or deleting an event.
- If the request is ambiguous, choose the general node.
</Constraint>

<UserRequest>
${userRequest}
</UserRequest>

<ChatHistory>
${JSON.stringify(chatHistory, null, 2)}
</ChatHistory>

Respond ONLY with the name of the selected node.
`;

export const conflictCheckPrompt = (
  userRequest: string,
  chatHistory: string[] = []
) => `
You are a smart conflict checker for a calendar assistant. Your job is to generate a sql query to check if the user's request conflicts with existing events.

<Constraint>
- If the request is related to listing events, do not check for conflicts.
- If the request is related to updating or deleting an event, check for conflicts with the existing events.
</Constraint>

<ChatHistory>
${JSON.stringify(chatHistory, null, 2)}
</ChatHistory>

<UserRequest>${userRequest}</UserRequest>
`;

export const userConfirmationPrompt = (
  sqlQuery: string,
  userRequest: string
) => `
Your job is the take the users request and generated sql query and generate a confirmation message for the user. 
Try to explain to the user in simple english what the sql query is attempting to do and if thats something they want to do.

<Query>${sqlQuery}</Query>

<UserRequest>${userRequest}</UserRequest>

<Constraint>
- The confirmation message should be clear and concise.
- Avoid technical jargon or SQL terms.
- Ensure the message is easy to understand for a non-technical user.
</Constraint>
`;

export const userConfirmationSystemPrompt = (confirmationMessage: string) => `
You are a smart confirmation checker for a calendar assistant. Your job is to decide whether the user confirmed the action based on the confirmation message.
<ConfirmationMessage>${confirmationMessage}</ConfirmationMessage>
`;
