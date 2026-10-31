# CCG design review

The editable website stays in this folder on the `design-refresh` branch. It is not connected to automatic Vercel deployments. The live brownccg.com site and the original GitHub deployment remain unchanged.

## Separate Vercel review project

- Account/team: Nate (`nate-3269`)
- Project: `ccg-design-review-20261031`
- Only the built static site in `.review-preview` is uploaded. The source code, `.env`, and Contentful tokens stay local.
- Published Contentful content is read during each local build. Rebuild the review copy to include later Contentful edits.
- Vercel requires the first deployment of a new project to use its Production environment. Here that means only this separate review project, never brownccg.com. Subsequent uploads can use Preview.
- The review output includes `noindex` headers and robots instructions to discourage search indexing; these do not restrict visitor access.

## Incorporating feedback

Continue making changes in this same checkout. `npm run dev` starts the editable local version. When ready to share an update, `npm run review:deploy` builds the site locally and uploads a new preview to the review project. It prints the new review URL. If Vercel protects the preview, use the deployment's Share control to create a link for reviewers.

Contact and recruitment forms retain their existing destinations; use the preview for visual review without submitting test messages.

## Recovery copy

A local Git backup is saved at `.review-backups/ccg-design-refresh.bundle`. It contains committed source and history, without ignored credentials or dependencies. To recover into another folder, run `git clone /absolute/path/to/.review-backups/ccg-design-refresh.bundle ccg-recovered`, then check out `design-refresh`, install dependencies, and restore the local `.env` separately. The working checkout and `.env` are being kept as they are.
