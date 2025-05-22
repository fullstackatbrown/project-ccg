import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

export async function fetchClients() {
  try {
    const response = await client.getEntries({ content_type: "clients" });

    // Transform the fetched data into an array of client objects
    return response.items.map((item) => ({
      id: item.sys.id,
      companyName: item.fields.companyName,
      industry: item.fields.industry,
      description: item.fields.description,
      summary: item.fields.summary,
      logo: item.fields.logo
        ? `https:${item.fields.logo.fields.file.url}`
        : null,
      slideUrl: item.fields.engagementSlide
        ? `https:${item.fields.engagementSlide.fields.file.url}`
        : null,
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}
