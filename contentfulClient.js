import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

async function fetchImageById(entryId) {
  try {
    const entry = await client.getEntry(entryId);
    console.log("Fetched Entry:", entry);

    // Check if the entry has an "images" field
    if (entry.fields.images && entry.fields.images.length > 0) {
      // Extract the first image from the array
      const imageUrl = `https:${entry.fields.images[0].fields.file.url}`;

      // Set the image URL in the HTML
      document.getElementById("contentful-image").src = imageUrl;
    } else {
      console.error("No images found in this entry.");
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

// // Call the function with a specific Entry ID
// fetchImageById("QD02xJjeDzhkY3Sm8bu1h");
