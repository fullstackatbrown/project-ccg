import * as contentful from "contentful";
import type { EntryFieldTypes } from "contentful";

export interface Member {
  contentTypeId: "member";
  fields: {
    memberName: EntryFieldTypes.Text;
  };
}

export const contentfulClient = contentful.createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
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
