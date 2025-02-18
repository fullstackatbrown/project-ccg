import contentful from 'contentful';

const contentful = require('contentful')

const client = contentful.createClient({
  space: '4evwxmhrlmjd',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'wIZOtSpgvJ2TyST9SaXwi455DJD44NCZwnu0f15Kr3c'
});

// for a single entry:

// export async function getEntry(entryId) {
//   try {
//     const entry = await client.getEntry(entryId);
//     return entry;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

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

// Now that we have a utility to fetch content from Contentful, we can use it in
// our Astro pages or components. For example, to display the content of an entry
// on a page, we could update our index.astro file to fetch it from Contentful.