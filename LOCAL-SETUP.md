# Local website setup

Repository: https://github.com/fullstackatbrown/project-ccg
Branch: design-refresh

1. Fill in `.env` with the existing CCG Contentful Space ID and Content Delivery API access token. The file is ignored by Git. A new empty Contentful space will not contain the website content.
2. Run `npm run dev` and open http://localhost:4321.
3. Run `npm run build` to verify all pages once credentials are available.

Local development now reads published content by default. To deliberately preview unpublished drafts, set CONTENTFUL_USE_PREVIEW=true and supply the corresponding Preview API token. Production builds always use the Delivery API. No Content Management token is required.

The Delivery API is read-only. Running the development server does not publish content or deploy the website.

## Branding reference

CCG Branding Guide: Crimson #8d0428, light tan #fae7bc, blue #173884, vivid crimson #c41230, white and black. Primary pairing is crimson and tan; blue is used sparingly. Official website fonts: Aileron bold headings, Cooper Hewitt subheadings, PT Sans body. These are references for the subsequent redesign; no visual changes have been made yet.
