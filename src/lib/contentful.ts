import * as contentful from "contentful";
import type { EntryFieldTypes } from "contentful";

export interface Member {
  contentTypeId: "member";
  fields: {
    memberName: EntryFieldTypes.Text;
  };
}

// Published content by default; draft preview is an explicit local opt-in.
const usePreview = import.meta.env.DEV && import.meta.env.CONTENTFUL_USE_PREVIEW === "true";

export const contentfulClient = contentful.createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: usePreview
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
  host: usePreview ? "preview.contentful.com" : "cdn.contentful.com",
});

// for multiple entries:

// export async function getEntries() {
//     try {
//       const entries = await client.getEntries();
//       return entries.items;
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   }
