import { defineCollection, z } from "astro:content";

const PagesSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  banner: z.object({
    hidden: z.boolean().optional(),
    extra_classes: z.string().optional(),
    content: z.string().optional()
  }).optional(),
  sections: z.array(
    z.object({
      title: z.string(),
      heading: z.string().optional(),
      linkable: z.boolean().optional(),
      size: z.enum(["auto", "full_screen"]).optional(),
      content_blocks: z.array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("rich_text"),
            content: z.string(), // Markdown content
            content_style: z.enum(["light", "dark"]).optional(),
            content_background: z.boolean().optional(),
            extra_classes: z.string().optional()
          }),
          z.object({
            type: z.literal("aside"),
            image: z.string().optional(),
            alt: z.string().optional(),
            caption: z.string().optional(),
            image_extra_classes: z.string().optional(),
            content: z.string().optional(), // Markdown content
            content_extra_classes: z.string().optional(),
            image_aspect_ratio: z.enum(["aspect-auto", "aspect-square", "aspect-3/2"]).optional(),
            x_pos: z.number().optional(),
            y_pos: z.number().optional(),
            image_placement: z.enum(["before", "after"]).optional()
          }),
          z.object({
            type: z.literal("newsletter_signup"),
            show_signup_form: z.boolean().optional(),
          })
        ])
      ).optional(),
      content_style: z.enum(["light", "dark"]).optional(),
      x_pos: z.enum(["left", "center", "right"]).optional(),
      y_pos: z.enum(["top", "center", "bottom"]).optional(),
      content_background: z.boolean().optional(),
      extra_classes: z.string().optional(),
      background_color: z.string().optional(), // color hex or code
      images: z.array(
        z.object({
          image: z.string(),
          fit: z.enum(["contain", "cover", "fill", "none"]).optional(),
          x_pos: z.number().optional(),
          y_pos: z.number().optional(),
          alt: z.string().optional(),
          caption: z.string().optional()
        })
      ).optional(),
      image_presentation: z.enum(["carousel", "grid"]).optional(),
      parallax: z.boolean().optional()
    })
  )
});

export type Page = z.infer<typeof PagesSchema>;
export const collections = {
  pages: defineCollection({
    schema: PagesSchema
  })
};
