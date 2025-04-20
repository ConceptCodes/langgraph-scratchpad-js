import boxen from "boxen";
import fs from "fs";
import { tavily, type TavilySearchResponse } from "@tavily/core";

import "dotenv/config";

type ColorName = Bun.ColorInput;

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const drawGraph = async (graph: any, filepath: string) => {
  const test = await graph.getGraphAsync();
  const image = await test.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();

  fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
};

export const getRandomThreadId = () => {
  return Math.random().toString(36).substring(7);
};

export const prettifyOutput = (
  content: string,
  colorName: ColorName = "white"
) => {
  Bun.color(colorName, "css");

  console.log(
    boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
    })
  );
};

export const tavilySearch = async (
  query: string,
  maxResults: number = 3
): Promise<TavilySearchResponse> => {
  try {
    const response = await tvly.search(query, {
      maxResults,
      includeRawContent: false,
      searchDepth: "basic",
    });

    return response;
  } catch (error) {
    console.error("Error calling Tavily API:", error);
    throw error;
  }
};

export const deduplicateAndFormatSources = (
  searchResponse: TavilySearchResponse[],
  maxTokensPerSource: number
) => {
  const uniqueSources: Record<string, TavilySearchResponse["results"][0]> = {};
  for (const source of searchResponse) {
    source.results.forEach((source) => {
      if (!uniqueSources[source.url]) {
        uniqueSources[source.url] = source;
      }
    });
  }

  let formattedText = "Sources:\n\n";
  Object.values(uniqueSources).forEach((source) => {
    formattedText += `Source ${source.title}:\n===\n`;
    formattedText += `URL: ${source.url}\n===\n`;
    formattedText += `Most relevant content from source: ${source.content}\n===\n`;
    const charLimit = maxTokensPerSource * 4;
    let rawContent = source.rawContent ?? "";
    if (rawContent.length > charLimit) {
      rawContent = rawContent.substring(0, charLimit) + "... [truncated]";
    }
    formattedText += `Full source content limited to ${maxTokensPerSource} tokens: ${rawContent}\n\n`;
  });

  return formattedText.trim();
};
