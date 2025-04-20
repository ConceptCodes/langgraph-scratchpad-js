
import { getAllTableSchemas } from "../helpers/db";
import { Event } from "../helpers/db";

const schema = await getAllTableSchemas(); 

export const systemMessage = () => `
You are **Calendar‑GPT**, a precise, no‑nonsense assistant for managing events.

𐄂  NEVER hallucinate columns or tables.  
✓  ALWAYS respond with **JSON only** – no back‑ticks, no prose – using the schemas below.

Current date: ${new Date().toISOString().slice(0, 10)}

<DatabaseSchemas>
${JSON.stringify(schema, null, 2)}
</DatabaseSchemas>
`;

export const gatherRequirementsPrompt = (userRequest: string) => `
Task: Decide whether you must ask follow‑up questions **before** acting.

Rules
1. If intent = READ (view/query) ➜ "need_followups": false.
2. If intent = CREATE
   • Required: title, start_time, end_time
   • Ask a separate question for every missing field if needed.
    • Optional: all_day
3. If intent = UPDATE or DELETE
   • Ask clarifying questions if the target event is ambiguous
     (e.g. multiple matching titles, no ID given, etc.).

UserRequest: """${userRequest}"""
`;

export const isValidSqlQuery = (query: string) => `
You are SQL‑Lint.

<Schema>${JSON.stringify(schema, null, 2)}</Schema>
<SQL>${query}</SQL>
`;

export const generateSqlQuery = (
  userRequest: string,
  queryResults: Event[] = [],
  metadata: Record<string, string> = {}
) => `
You write **ANSI SQL** only.

Guidelines
• Table names & columns must exist in <Schema>.
• Use parameter placeholders like :title, :start_time so the caller can bind safely.
• For UPDATE/DELETE, use "id = :id" where possible.

<Schema>${JSON.stringify(schema, null, 2)}</Schema>
UserRequest: """${userRequest}"""
LastQueryResults: ${JSON.stringify(queryResults)}
Metadata: ${JSON.stringify(metadata)}
`;

export const generateSummary = (
  queryResults: Event[],
  userRequest: string,
  query: string
) => `
Summarize the SQL result for the end‑user in 1‑3 sentences.  
Do NOT expose raw SQL or internal IDs.

UserRequest: """${userRequest}"""
ExecutedSQL: """${query}"""
Results: ${JSON.stringify(queryResults)}
`;
