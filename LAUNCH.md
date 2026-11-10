# Production release and rollback

The official site is deployed by GitHub Pages from `main` in `fullstackatbrown/project-ccg`. The separate Vercel review project does not control brownccg.com. Follow the [website handoff](https://docs.google.com/document/d/1J0p5NRgo40BB9KRNp-psTbb0TZ_qq019tgkrqj8rtVM/edit): publish a branch, open a pull request, then merge the approved changes.

## Before merging

1. Run `node scripts/prepare-contentful-launch.mjs` to back up and review the CMS migration. Run again with `--apply` to populate the approved content. Its management token belongs only in ignored `.env.contentful-management.local`.
2. Run `CONTENTFUL_REQUIRE_EDITABLE_CONTENT=true npm run build`. This is also enforced by the production workflow. A missing migration stops the release instead of silently publishing hardcoded content.
3. Review the built homepage, Clients, Members, Recruitment, and Contact pages. Do not submit real contact forms as a test.
4. Push `design-refresh`, open its pull request into `main`, and squash merge to keep the release easy to revert. Save the resulting merge commit ID in the release record.
5. Verify the GitHub Pages workflow succeeds and check brownccg.com directly. Preserve the review branch and local checkout for future edits.

## Restore the previous design

The immutable local tag `pre-redesign-live-2026-10-31` identifies the exact original site at `2e5934bba1264f3890ca227a412dfd7d1b76a297`. A source archive and content backups are in ignored `.review-backups/production-before-2026-10-31/`. Publish this backup tag alongside the redesign branch before merging.

Preferred rollback: revert the single squash merge through a new pull request, merge it, and wait for the Pages workflow to complete. This preserves all history and leaves the redesign branch available for fixes. Do not reset or force-push main. If the release contains multiple commits, restore the tracked site files from the backup tag on a new branch and submit that as a rollback pull request.

The migration adds models and entries without deleting the old fields. The original homepage entry's pre-migration fields are retained in `management-content.json`. To restore the original copy as well as layout, restore that entry's fields using its current version number, publish it, then republish Site Rebuild Trigger. Preserve new linked entries for future use; they do not need to be deleted. Coordinate rollback with editors so newer content changes are not overwritten.

## Contentful editing

Existing Members, Clients, Recruitment, Reports, Images, Our Services and Our Values remain in their original models. Publish changes, then update and publish **Site Rebuild Trigger** as the handoff describes.

The existing Homepage entry now also controls:

- Who We Are copy and section headings.
- Trusted by Industry Leaders heading, description, link label, and ordered featured-client references.
- Alumni introduction and ordered industry references. Each industry contains an ordered list of destinations; edit a destination to replace its logo or name. Logo surface and sizing options preserve the approved card treatments.
- A linked Clients Page entry for page and section headings, values photo, the ordered process steps, and the three fully developed pinned engagements.

Use the reference-list ordering controls to reorder clients, industries, destinations, or process steps. Upload replacement logos as Contentful Assets. Keep pinned client work limited to clients with full descriptions. Ordinary client entries still populate Explore All Clients and Selected Engagements.

Design, colors, layout, animations, and navigation remain code-controlled, as before. Contentful edits populate the static site after its rebuild; publishing an entry alone does not deploy code. The migration script skips its previously published seed entries so rerunning it does not overwrite later editor changes.

## November portfolio release

The November 1 release keeps the entire approved portfolio in Contentful. Development and production use published CMS content by default; `PORTFOLIO_REVIEW=true` is only an explicit historical spreadsheet-preview override.

- **Clients**: edit Company Name, Semester, Short Description (hover preview), Long Description (project details), and Logo. A missing long description falls back to the short description. Education Co. intentionally has no logo.
- **Clients Page → Portfolio**: ordered references determine which projects are included. Add a new Clients entry here to include it in the searchable portfolio. Projects are grouped by Semester, newest first. The section headings, introductions, and portfolio link label are editable on this entry.
- **Homepage → Featured Clients**: the ordered references select the shared featured eight on both Home and Clients. Select projects already included in Clients Page → Portfolio. Reorder the references to change the featured order.
- **Homepage → Alumni Industries**: controls the ordered alumni scenes. Each Alumni Industry has an editable title and ordered Destinations. Consulting, Investment Banking, Investing & Trading, Tech, and And More are the approved initial scenes. The bottom navigation remains three tabs.
- **Alumni Destination**: edit the company name, logo asset, surface variant, optional card background hex color, logo fit, logo padding, and existing sizing/caption options. Background and padding fields override the initial design's defaults.

Publish changed entries and linked assets, then update and publish Site Rebuild Trigger as before. Contentful changes appear after the GitHub Pages rebuild. No code changes are needed for ordinary project copy, company logos, featured selection, or membership/order changes.

The pre-release source is tagged `pre-feedback-live-2026-11-01`. Its source archive and full management-content backup are retained in `.review-backups/production-before-2026-11-01/`. Squash merge the release so reverting one commit restores the previous code. If CMS content must also be restored, use the saved backup and coordinate with editors to preserve changes made since the release; new unreferenced entries need not be deleted.

## Member profiles and order (November 2026)

Member bios and headshots remain editable on each **Member** entry in Contentful. **Display Order** controls placement within the existing leadership role groups and within Consultants. Leadership roles and the hierarchy are unchanged. Lower display-order numbers appear first. Returning consultants occupy the initial positions; append new consultants with larger numbers. A profile without a Display Order sorts after the numbered profiles.

Publish the replacement headshot asset and member entry, then publish the Site Rebuild Trigger to refresh the live website. The November 9 import preserves names, positions, class years, contact details, and LinkedIn URLs on existing members; only their submitted bios/photos and display-order metadata are updated. Members without new bios remain unchanged apart from order metadata.

## Contentful refresh reliability and profile links (November 10)

Contentful's Site Rebuild Trigger keeps its existing repository-dispatch webhook and credential. A small routing job starts the actual deployment as workflow_dispatch using a short-lived Actions token limited to this repository. Only that routing job has actions:write; the build and deployment retain their previous permissions. This avoids the GitHub Pages behavior that can report success while continuing to serve the artifact from a prior run of the same source revision. Every build writes a unique release manifest; deployment succeeds only after the public HTML on all five routes matches that build. After publishing Site Rebuild Trigger, check the subsequent workflow-dispatch run and its final verification step. The repository-dispatch routing run only confirms that the deployment was queued.

Member LinkedIn fields should contain the full `https://www.linkedin.com/in/.../` URL. The site also normalizes pasted bare domains, strips accidental spaces and share parameters, forces HTTPS, and hides unsupported/non-LinkedIn URLs instead of emitting a broken relative link. A blank field remains blank.
