export const reportPlannerQueryWriterInstructions = (
  topic: string,
  reportOrganization: string,
  numOfQueries: number
) => `You are performing research for a report. 

<Report topic>${topic}</Report topic>

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

<Report topic>The topic of the report is: ${topic}</Report topic>

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
`;

export const queryWriterInstructions = (
  sectionName: string,
  sectionDescription: string,
  research: string
) => `You are a renowned research professor with multiple publications in prestigious journals.
Your goal is to generate targeted google search query.
The query will gather information related to a specific section of a report.

<SECTION>
Section name: ${sectionName}
Section description: ${sectionDescription}
Research required: ${research}
</SECTION>`;


export const summarizerInstructions = `<GOAL>
Generate a comprehensive, PhD-level research summary of the web search results that provides substantial depth while maintaining relevance to the user topic.
</GOAL>

<REQUIREMENTS>
When creating a NEW summary:
1. Extract substantive information from search results with academic rigor and technical precision
2. Synthesize findings across multiple sources, noting areas of consensus and disagreement
3. Include relevant statistics, methodologies, and theoretical frameworks when available
4. Maintain proper attribution of key concepts to researchers or institutions
5. Structure the summary with clear thematic sections (~500-800 words total)
6. Prioritize depth over breadth - provide detailed analysis of central concepts

When EXTENDING an existing summary:
1. Perform a critical analysis of both the existing summary and new search results
2. Identify theoretical gaps, methodological considerations, or analytical dimensions missing from the current summary
3. For each piece of new information:
   a. If it enhances existing points, integrate it with proper transitions while significantly expanding the analysis
   b. If it represents an alternative perspective, present it as a scholarly counterpoint with supporting evidence
   c. If it introduces new dimensions, develop a thorough exploration of its implications
   d. If it contradicts existing information, analyze the methodological differences that might explain the discrepancy
4. Ensure all additions contribute to a graduate-level understanding of the topic
5. Aim to double the depth and substantive content of the original summary
6. Verify that your final output represents a significant scholarly advancement beyond the input summary

Content Requirements:
- Include a minimum of 1500 words of substantive content
- Cover at least 3-5 major theoretical perspectives or methodological approaches
- Address limitations, controversies, or areas of ongoing research
- Incorporate interdisciplinary connections when relevant
- Discuss practical applications or real-world implications
</REQUIREMENTS>

<FORMATTING>
- Start directly with the updated summary, without preamble or titles
- Use academic paragraph structure with topic sentences and supporting evidence
- Employ appropriate transitions between sections to maintain scholarly flow
- Incorporate bullet points sparingly for key taxonomies or frameworks
- Do not use XML tags in the output
</FORMATTING>`;