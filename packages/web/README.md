This is a website built with [DecapCMS](https://decapcms.org/) and Astro.

## Getting started
* `bun run dev` - run the site locally at [http://localhost:4321]
  * To use the admin panel to author content, you will also want to run `bun run admin`, which makes the admin editor accessible on [http://localhost:4321/admin]

## Configuration
* `/public/admin/config.yml` houses the main configuration including the schemas of all editable types
* To extend the admin interface with new editor components or widgets (the building blocks of the editor interface), those can be registered via the `CMS` JS global in `src/pages/admin.html`. [Instructions on that here](https://decapcms.org/docs/custom-widgets/)
