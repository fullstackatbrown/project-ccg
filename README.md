## Collegiate Consulting Group Website

### Basic Setup

To set up your environment for local development, clone into this repo and open it. Then, do the following:

1. `npm i` to install dependencies.
2. Create a `.env` file in the root of the project directory, with the following format:
```
PUBLIC_CONTENTFUL_SPACE_ID=ADD_KEY_HERE
PUBLIC_CONTENTFUL_DELIVERY_TOKEN=ADD_KEY_HERE
PUBLIC_CONTENTFUL_PREVIEW_TOKEN=ADD_KEY_HERE
```
3. `npm run dev` to start the local development server.

### Project Directory Organization

```
.
├── .github/workflows/      ----> YAML files for triggering site rebuilds
├── .env              ----------> create this to hold API keys
├── public/           ----------> holds non-code, unprocessed assets
│   └── assets/
│       ├── companies/        --> contains images of company logos
│       ├── images/           --> contain misc. icons, banners, and images
│       └── other misc photos also:
│           ├── logo.png
│           ├── report.jpg
│           └── and a few more
└── src/              ----------> project source code
    ├── layouts/            ----> shared UI structure by one or more pages
    │   └── Layout.astro      --> entry point for website, wraps ALL other components
    ├── pages/              ----> important: page routes created in this dir
    │   ├── index.astro       --> HOME PAGE
    │   ├── members.astro     --> MEMBERS PAGE
    │   ├── recruitment.astro --> RECRUITMENT PAGE
    │   ├── services.astro    --> SERVICES PAGE
    │   └── contact.astro     --> CONTACT PAGE 
    ├── styling/
    │   └── global.css      ----> globals, we generally use inline Tailwind instead
    ├── components/
    │   ├── common/           --> sections used across multiple pages (e.g. AnnualReport)
    │   ├── homepage/         --> component sections for the homepage
    │   ├── members/          --> component sections for the members page 
    │   ├── recruitment/      --> component sections for the recruitment page
    │   ├── services/         --> component sections for the services page
    │   └── various misc Astro components also:
    │       ├── FAQ.astro
    │       ├── Welcome.astro
    │       └── and a few more
    └── lib/
        └── contentful.ts     --> contentfulClient init code
```

### About Astro

Astro is a modern web framework for building fast sites - it ships no JS by default and renders pages statically or with SSR.

Find [Astro documentation here](https://docs.astro.build). For the folder structure of an Astro project, refer [here](https://docs.astro.build/en/basics/project-structure/).

#### Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
