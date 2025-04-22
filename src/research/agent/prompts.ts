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
  numOfQueries: number
) => `You are an expert technical writer crafting targeted web search queries that will gather comprehensive information for writing a technical report section.

<Report topic>
${sectionName}
</Report topic>

<Section topic>
${sectionDescription}
</Section topic>

<Task>
Your goal is to generate ${numOfQueries} search queries that will help gather comprehensive information above the section topic. 

The queries should:

1. Be related to the topic 
2. Examine different aspects of the topic

Make the queries specific enough to find high-quality, relevant sources.
</Task>`;

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

export const finalSectionWriterInstructions = (
  topic: string,
  sectionName: string,
  sectionTopic: string,
  context: string
) => `You are an expert technical writer crafting a section that synthesizes information from the rest of the report.

<Report topic>
${topic}
</Report topic>

<Section name>
${sectionName}
</Section name>

<Section topic> 
${sectionTopic}
</Section topic>

<Available report content>
${context}
</Available report content>

<Task>
1. Section-Specific Approach:

For Introduction:
- Use # for report title (Markdown format)
- 50-100 word limit
- Write in simple and clear language
- Focus on the core motivation for the report in 1-2 paragraphs
- Use a clear narrative arc to introduce the report
- Include NO structural elements (no lists or tables)
- No sources section needed

For Conclusion/Summary:
- Use ## for section title (Markdown format)
- 100-150 word limit
- For comparative reports:
    * Must include a focused comparison table using Markdown table syntax
    * Table should distill insights from the report
    * Keep table entries clear and concise
- For non-comparative reports: 
    * Only use ONE structural element IF it helps distill the points made in the report:
    * Either a focused table comparing items present in the report (using Markdown table syntax)
    * Or a short list using proper Markdown list syntax:
      - Use \`*\` or \`-\` for unordered lists
      - Use \`1.\` for ordered lists
      - Ensure proper indentation and spacing
- End with specific next steps or implications
- No sources section needed

3. Writing Approach:
- Use concrete details over general statements
- Make every word count
- Focus on your single most important point
</Task>

<Quality Checks>
- For introduction: 50-100 word limit, # for report title, no structural elements, no sources section
- For conclusion: 100-150 word limit, ## for section title, only ONE structural element at most, no sources section
- Markdown format
- Do not include word count or any preamble in your response
</Quality Checks>`;

export const sectionWriterInstructions = `Write one section of a research report.
<Task>
1. Review the report topic, section name, and section topic carefully.
2. If present, review any existing section content. 
3. Then, look at the provided Source material.
4. Decide the sources that you will use it to write a report section.
5. Write the report section and list your sources. 
</Task>

<Writing Guidelines>
- If existing section content is not populated, write from scratch
- If existing section content is populated, synthesize it with the source material
- Strict 150-200 word limit
- Use simple, clear language
- Use short paragraphs (2-3 sentences max)
- Use ## for section title (Markdown format)
</Writing Guidelines>

<Citation Rules>
- Assign each unique URL a single citation number in your text
- End with ### Sources that lists each source with corresponding numbers
- IMPORTANT: Number sources sequentially without gaps (1,2,3,4...) in the final list regardless of which sources you choose
- Example format:
  [1] Source Title: URL
  [2] Source Title: URL
</Citation Rules>

<Final Check>
1. Verify that EVERY claim is grounded in the provided Source material
2. Confirm each URL appears ONLY ONCE in the Source list
3. Verify that sources are numbered sequentially (1,2,3...) without any gaps
</Final Check>
"""
`;

export const sectionWriterPrompt = (
  topic: string,
  sectionName: string,
  sectionTopic: string,
  context: string,
  sectionContent: string
) => `
"""
<Report topic>
${topic}
</Report topic>

<Section name>
${sectionName}
</Section name>

<Section topic>
${sectionTopic}
</Section topic>

<Existing section content (if populated)>
${sectionContent}
</Existing section content>

<Source material>
${context}
</Source material>
"""
`;

export const sectionGraderInstructions = (
  topic: string,
  sectionTopic: string,
  section: string,
  numberOfFollowUpQueries: number
) => `Review a report section relative to the specified topic:

<Report topic>
${topic}
</Report topic>

<section topic>
${sectionTopic}
</section topic>

<section content>
${section}
</section content>

<task>
Evaluate whether the section content adequately addresses the section topic.

If the section content does not adequately address the section topic, generate ${numberOfFollowUpQueries} follow-up search queries to gather missing information.
</task>
`;

export const sectionGraderPrompt = `Grade the report and consider follow-up questions for missing information. 
If the grade is 'fail', provide specific search queries to gather missing information.
if the grade is 'pass', no follow-up queries are needed.
`;
