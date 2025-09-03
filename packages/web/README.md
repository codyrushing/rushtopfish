This is a website built with [DecapCMS](https://decapcms.org/) and Astro.

## Getting started
* `bun run dev` - run the site locally at [http://localhost:4321]
  * To use the admin panel to author content, you will also want to run `bun run admin`, which makes the admin editor accessible on [http://localhost:4321/admin]

## Configuration
* `/public/admin/config.yml` houses the main configuration including the schemas of all editable types
* To extend the admin interface with new editor components or widgets (the building blocks of the editor interface), those can be registered via the `CMS` JS global in `src/pages/admin.html`. [Instructions on that here](https://decapcms.org/docs/custom-widgets/)

## Using the admin panel
For dev, you just need to set the project up to use open registration, which can be done in the Netlify identity panel.  Once that is setup, you can just navigate to `/admin` and you can just login with a single click.

For prod, you will want to use closed registration so that only invited users can edit the site. When an admin user is added in the Netlify panel, it sends them an invite email.
