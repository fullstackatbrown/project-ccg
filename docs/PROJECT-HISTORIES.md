# Member project histories and engagement credits

In Contentful, use **Content → Project Assignment** to maintain both member project pills and project leadership credits. Each entry connects one person to one specific client engagement.

- **Project:** the existing Clients entry, including its semester.
- **Member:** the member entry, when one exists. This link places the project on that person's profile. Linking a former member does not reactivate their profile.
- **Person Name:** the public name shown in project credits. Use a confirmed full name.
- **Role:** Consultant, Project Leader, or Project Manager for this engagement. This does not change the member's club role.
- **Display Order:** controls ordering among teammates. Member pills always sort by project semester, newest first.
- **Source Notes:** the record used to confirm the assignment.

Create an assignment for every confirmed participant. Project Leader and Project Manager assignments appear beneath the engagement writeup; Consultant assignments only add profile pills. Projects without confirmed leadership records show their writeups without an empty credits section. All 37 portfolio engagements remain available regardless of whether any assignments exist.

Publish the assignment, then publish the existing **Site Rebuild Trigger** entry to update the static website. Correct semesters on the Clients entry itself; that updates both portfolio dates and member-pill ordering. Do not infer project leadership from a member's current club title.

Pill colors reflect each company's logo family. Edit **Clients → Pill Color Family** to choose red, cream, brown, green, blue, orange or purple. Every company in a family uses the same muted shade; colors do not encode role or semester. Neutral and multicolor logos default to brown. Company and semester appear side by side in compact pills.

The November 2026 import uses the supplied Fall 2026 roster and these reports:

- [2025–26 annual report](https://drive.google.com/file/d/13-H36GuCYX79HGEhOfxCbJnYO-7CjWaq/view)
- [2024–25 annual report](https://drive.google.com/file/d/1x1uMpFgvABZg_wnDpaP8CPbTjQ-5bvjG/view)
- [2023–24 annual report](https://drive.google.com/file/d/1EaSzLtiD2xrSTHufza2KGOiykpxMVl4L/view)

Nathan confirmed GitHub, Substack, UNDP, Boston Public Library and CAVA were Fall 2025 despite conflicting individual-page labels in the 2025–26 report. Unconfirmed historical names Katrina, Hanadi, Vincent and Oscar were omitted at his request. No roster phone numbers were imported. No project memberships were inferred for members without supporting records.

`scripts/import-project-assignments.mjs <verified-plan.json>` creates the model if needed and publishes a reviewed import. Source plans, before-state backups and original photographs are retained locally under ignored `.review-backups/`; credentials are never committed.
