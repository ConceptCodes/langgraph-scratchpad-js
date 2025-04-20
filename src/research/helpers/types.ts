export type Source = { url: string; title: string };

export type Section = {
  title: string;
  content?: string;
  description: string;
  sources?: Source[];
  research: string;
};
