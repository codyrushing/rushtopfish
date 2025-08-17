import { defineCollection, z } from "astro:content";

const PagesSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      linkable: z.boolean().optional(),
      size: z.enum(["auto", "full_screen"]).optional(),
      content: z.string().optional(), // Markdown content
      images: z.array(
        z.object({
          image: z.string(),
          fit: z.enum(["contain", "cover", "fill", "none"]).optional(),
          media_x_pos: z.number().optional(),
          media_y_pos: z.number().optional(),
          background_color: z.string().optional(), // color hex or code
          caption: z.string().optional()
        })
      ).optional(),
      image_presentation: z.enum(["carousel", "grid"]).optional(),
      parallax: z.boolean().optional()
    })
  ),
});

const pages = defineCollection({
  schema: PagesSchema
});
export type Page = z.infer<typeof PagesSchema>;

export const collections = {
  pages
};
