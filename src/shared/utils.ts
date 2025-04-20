import boxen from "boxen";
import fs from "fs";

type ColorName = Bun.ColorInput;

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
