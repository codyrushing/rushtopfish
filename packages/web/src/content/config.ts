// AUTO-GENERATED from public/admin/config.yml
// Run: bun run scripts/generate-content-config.ts

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ======================= SHARED SCHEMAS =======================

export const BannerSchema = z.object({
  hidden: z.boolean().optional(),
  extra_classes: z.string().optional(),
  content: z.string().optional()
});

export const BgMediaSchema = z.object({
  media: z.string(),
  fit: z.enum(["contain", "cover", "fill", "none"]).optional(),
  x_pos: z.number().int().optional(),
  y_pos: z.number().int().optional(),
  alt: z.string().optional(),
  caption: z.string().optional()
});

export const PageSectionSchema = z.object({
  title: z.string(),
  heading: z.string().optional(),
  linkable: z.boolean().optional(),
  size: z.enum(["auto", "full_screen"]).optional(),
  content_blocks: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("rich_text"),
      content: z.string(),
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
      content: z.string().optional(),
      content_extra_classes: z.string().optional(),
      image_aspect_ratio: z.enum(["aspect-auto", "aspect-square", "aspect-3/2"]).optional(),
      x_pos: z.number().int().optional(),
      y_pos: z.number().int().optional()
    }),
    z.object({
      type: z.literal("newsletter_signup"),
      show_signup_form: z.boolean().optional()
    })
  ]).optional(),
  content_style: z.enum(["light", "dark"]).optional(),
  content_background: z.boolean().optional(),
  x_pos: z.enum(["left", "center", "right"]).optional(),
  y_pos: z.enum(["top", "center", "bottom"]).optional(),
  extra_classes: z.string().optional(),
  background_color: z.string().optional(),
  images: z.array(BgMediaSchema).optional()
});

export const PageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  banner: BannerSchema.optional(),
  sections: z.array(PageSectionSchema).optional()
});

// ======================= COLLECTION SCHEMAS =======================

export const LandingPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  dance_media: BgMediaSchema,
  pilates_media: BgMediaSchema
});

// ======================= EXPORTED TYPES =======================

export type Banner = z.infer<typeof BannerSchema>;
export type BgMedia = z.infer<typeof BgMediaSchema>;
export type PageSection = z.infer<typeof PageSectionSchema>;
export type Page = z.infer<typeof PageSchema>;
export type LandingPage = z.infer<typeof LandingPageSchema>;

// ======================= COLLECTIONS =======================

export const collections = {
  landing_page: defineCollection({
    loader: glob({ pattern: "landing.yml", base: "./src/content/pages" }),
    schema: LandingPageSchema,
  }),
  pages_dance: defineCollection({
    loader: glob({ pattern: "home.yml", base: "./src/content/pages/dance" }),
    schema: PageSchema,
  }),
  banners_dance: defineCollection({
    loader: glob({ pattern: "**/*.{yml,md}", base: "./src/content/banners/dance" }),
    schema: BannerSchema,
  }),
  pages_pilates: defineCollection({
    loader: glob({ pattern: "home.yml", base: "./src/content/pages/pilates" }),
    schema: PageSchema,
  }),
  banners_pilates: defineCollection({
    loader: glob({ pattern: "**/*.{yml,md}", base: "./src/content/banners/pilates" }),
    schema: BannerSchema,
  })
};
