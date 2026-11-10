import { createClient } from "contentful";
import { loadProjectAssignments } from './src/lib/projectAssignments';

// Published content by default; draft preview is an explicit local opt-in.
const usePreview = import.meta.env.DEV && import.meta.env.CONTENTFUL_USE_PREVIEW === "true";

const client = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: usePreview
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
  host: usePreview ? "preview.contentful.com" : "cdn.contentful.com",
});

export async function fetchClients() {
  try {
    const response = await client.getEntries({ content_type: "clients", limit: 1000 });
    const assignments = await loadProjectAssignments();

    // Transform the fetched data into an array of client objects
    return response.items.map((item) => ({
      id: item.sys.id,
      leadership: assignments.filter(assignment => assignment.projectId === item.sys.id && assignment.role !== 'Consultant'),
      companyName: item.fields.companyName,
      industry: item.fields.industry,
      semester: item.fields.semester,
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
