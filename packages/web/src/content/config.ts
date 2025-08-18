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
      extra_classes: z.string().optional(),
      content: z.string().optional(), // Markdown content
      content_style: z.enum(["light", "dark"]).optional(),
      content_background: z.boolean().optional(),
      x_pos: z.enum(["left", "center", "right"]).optional(),
      y_pos: z.enum(["top", "center", "bottom"]).optional(),
      images: z.array(
        z.object({
          image: z.string(),
          fit: z.enum(["contain", "cover", "fill", "none"]).optional(),
          x_pos: z.number().optional(),
          y_pos: z.number().optional(),
          background_color: z.string().optional(), // color hex or code
          alt: z.string().optional(),
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
