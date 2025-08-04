// @ts-ignore
import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/pages" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string()
  }),
});

export const collections = { pages };
