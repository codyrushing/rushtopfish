# Keystatic in Astro

This template shows how you can use Keystatic in an Astro site.

To setup:

```bash
npm install
```

To run:

```
npm run dev
```

Admin UI: [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic)

Homepage: [http://localhost:4321](http://localhost:4321)

## Building static
* https://jankraus.net/2025/02/25/a-simple-guide-to-using-astro-with-keystatic/

## Strategy
* Create a `pages` collection in `keystatic.config.ts`
* `src/pages/[slug].astro` is the base Astro page to render each page.
  * Use the Keystatic Reader API to "call" Keystatic for data
* Use `<DocumentRenderer>` in `[slug].astro` to render richtext content. This is also where you register any custom content components.
```
<DocumentRenderer
  document={page.data.content}
  componentBlocks={{
    callout: Callout, // <===== custom content components
    imageGallery: ImageGallery,
  }}
/>
```

## Site
