import { config, fields, collection } from "@keystatic/core";
import { wrapper } from '@keystatic/core/content-components';

const galleryImage = fields.object

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    pages: collection({
      label: "Pages",
      path: "src/content/pages/*",
      slugField: "title",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.markdoc({
          label: "Content",
          options: {
            image: {
              directory: "src/assets/images/pages",
              publicPath: "../../assets/images/pages/",
            },
          },
          components: {
            // Content components here
            pageSection: wrapper({
              label: "Page section",
              schema: {
                featured_media: fields.conditional(
                  // First, define a `select` field with all the available "conditions"
                  fields.select({
                    label: 'Featured media',
                    description: 'Optional hero media',
                    options: [
                      { label: 'No media', value: 'none' },
                      { label: 'Image', value: 'image' },
                      // { label: 'Video', value: 'video' },
                    ],
                    defaultValue: 'none',
                  }),
                  // Then, provide a schema for each condition
                  {
                    // "none" condition
                    none: fields.empty(),
                    // "image" condition
                    image: fields.object({
                      asset: fields.image({
                        label: 'Image',
                        description: "Either upload an image here, or reference an existing image below",
                        directory: 'public/images/hero',
                        publicPath: '/images/hero',
                      }),
                      assetPathRef: fields.pathReference({
                        label: "Existing image",
                        pattern: 'public/**/*',
                      }),
                      alt: fields.text({ label: 'Alt', description: 'Image alt text.' }),
                      mediaFit: fields.select({
                        label: "Media fit",
                        defaultValue: "none",
                        options: [
                          { label: "None", value: "none" },
                          { label: "Cover", value: "cover" },
                          { label: "Contain", value: "contain" },
                          { label: "Fill", value: "fill" }
                        ]
                      }),
                      mediaPositionX: fields.select({
                        label: "Media horizontal position",
                        defaultValue: "center",
                        options: [
                          { label: "Center", value: "center" },
                          { label: "Left", value: "left" },
                          { label: "Right", value: "right" }
                        ]
                      }),
                      mediaPositionY: fields.select({
                        label: "Media vertical position",
                        defaultValue: "center",
                        options: [
                          { label: "Center", value: "center" },
                          { label: "Top", value: "top" },
                          { label: "Bottom", value: "bottom" }
                        ]
                      })
                    })
                  }
                )
              }
            })
          }
        }),
      }
    }),
    // posts: collection({
    //   label: "Posts",
    //   slugField: "title",
    //   path: "src/content/posts/*",
    //   format: { contentField: "content" },
    //   schema: {
    //     title: fields.slug({ name: { label: "Title" } }),
    //     gallery: fields.array(fields.image({ label: "Gallery Image" }), {
    //       label: "Gallery",
    //     }),
    //     content: fields.markdoc({
    //       label: "Content",
    //       options: {
    //         image: {
    //           directory: "src/assets/images/posts",
    //           publicPath: "../../assets/images/posts/",
    //         },
    //       },
    //     }),
    //   },
    // }),
  },
});
