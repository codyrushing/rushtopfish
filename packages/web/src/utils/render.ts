import { marked } from "marked";
import type { MarkedOptions } from "marked";

export async function renderMarkdown(markdown:string, options?: MarkedOptions) : Promise<string> {
  return await marked.parse(markdown, options);
}
