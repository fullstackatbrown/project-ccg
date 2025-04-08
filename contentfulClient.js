import { createClient } from 'contentful';


const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

export async function fetchClients() {
  try {
    const response = await client.getEntries({ content_type: 'clients' });
    
    // Transform the fetched data into an array of client objects
    return response.items.map((item) => ({
      id: item.sys.id,
      companyName: item.fields.companyName,
      industry: item.fields.industry,
      description: item.fields.description,
      logo: item.fields.logo ? `https:${item.fields.logo.fields.file.url}` : null
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

async function fetchImageById(entryId) {
  try {
    const entry = await client.getEntry(entryId);
    console.log('Fetched Entry:', entry);

    // Check if the entry has an "images" field
    if (entry.fields.images && entry.fields.images.length > 0) {
      // Extract the first image from the array
      const imageUrl = `https:${entry.fields.images[0].fields.file.url}`;
      
      // Set the image URL in the HTML
      document.getElementById('contentful-image').src = imageUrl;
    } else {
      console.error('No images found in this entry.');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// // Call the function with a specific Entry ID
fetchImageById('QD02xJjeDzhkY3Sm8bu1h');

