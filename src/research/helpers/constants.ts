export enum Nodes {
  GENERATE_RESEARCH_PLAN = "GENERATE_RESEARCH_PLAN",
  EXECUTE_PLAN = "EXECUTE_PLAN",
  BUILD_SECTION = "BUILD_SECTION",
  GENERATE_QUERY = "GENERATE_QUERY",
  WEB_SEARCH = "WEB_SEARCH",
  WRITE_SECTION = "WRITE_SECTION",
  GATHER_COMPLETED_SECTIONS = "GATHER_COMPLETED_SECTIONS",
  SUMMARIZE_SOURCES = "SUMMARIZE_SOURCES",
  REFLECT_ON_SUMMARY = "REFLECT_ON_SUMMARY",
  WRITE_FINAL_SECTIONS = "WRITE_FINAL_SECTIONS",
  COMPILE_FINAL_REPORT = "COMPILE_FINAL_REPORT",
}

export const DEFAULT_REPORT_STRUCTURE = `Use this structure to create a report on the user-provided topic:

1. Introduction (no research needed)
   - Brief overview of the topic area

2. Main Body Sections:
   - Each section should focus on a sub-topic of the user-provided topic
   
3. Conclusion
   - Aim for 1 structural element (either a list of table) that distills the main body sections 
   - Provide a concise summary of the report
`;

export const NUMBER_OF_QUERIES = 3;
export const MAX_TOKENS_PER_SOURCE = 2000;
export const MAX_SEARCH_RESULTS = 3;
