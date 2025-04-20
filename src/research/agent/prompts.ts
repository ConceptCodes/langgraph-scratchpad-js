export const reportPlannerQueryWriterInstructions = (
  topic: string,
  reportOrganization: string,
  numOfQueries: number
) => `You are performing research for a report. 

<Report topic>
${topic}
</Report topic>

<Report organization>
${reportOrganization}
</Report organization>

<Task>
Your goal is to generate ${numOfQueries} web search queries that will help gather information for planning the report sections. 

The queries should:

1. Be related to the Report topic
2. Help satisfy the requirements specified in the report organization

Make the queries specific enough to find high-quality, relevant sources while covering the breadth needed for the report structure.
</Task>
`;

export const reportPlannerInstructions = (
  topic: string,
  reportOrganization: string,
  context: string
) => `I want a plan for a report that is concise and focused.

<Report topic>
The topic of the report is:
${topic}
</Report topic>

<Report organization>
The report should follow this organization:
${reportOrganization}
</Report organization>

<Context>
Here is context to use to plan the sections of the report:
${context}
</Context>

<Task>
Generate a list of sections for the report. Your plan should be tight and focused with NO overlapping sections or unnecessary filler.

For example, a good report structure might look like:
1/ intro
2/ overview of topic A
3/ overview of topic B
4/ comparison between A and B
5/ conclusion

Each section should have the fields:

- Name - Name for this section of the report.
- Description - Brief overview of the main topics covered in this section.
- Content - The content of the section, which you will leave blank for now.

Integration guidelines:
- Include examples and implementation details within main topic sections, not as separate sections
- Ensure each section has a distinct purpose with no content overlap
- Combine related concepts rather than separating them

Before submitting, review your structure to ensure it has no redundant sections and follows a logical flow.
</Task>

<Format>
Call the Sections tool
</Format>
`;

export const queryWriterInstructions = (
  sectionName: string,
  sectionDescription: string,
  research: string
) => `You are a renowned research professor with multiple publications in prestigious journals.
Your goal is to generate targeted web search queries.
The query will gather information related to a specific section of a report.

<SECTION>
Section name: ${sectionName}
Section description: ${sectionDescription}
Research required: ${research}
</SECTION>

Provide your response in JSON format:`;
