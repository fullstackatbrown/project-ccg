export const projectPillFamilies = ['red','cream','brown','green','blue','orange','purple'] as const;
export type ProjectPillFamily = typeof projectPillFamilies[number];

// Based on the actual portfolio logos. Neutral and multicolor marks use warm brown.
export const projectPillColorDefaults: Record<string,ProjectPillFamily> = {
 'Adobe':'red', 'Impossible Foods':'red', 'Perkies':'red',
 'CAVA':'cream', 'Wildfire Strategies':'cream',
 'Whole Foods':'green', 'Shopify':'green', 'Grammarly':'green', 'Plant People':'green', 'Remento':'green',
 'IBM':'blue', 'UNDP':'blue', 'Coursera':'blue', 'Neurosteer':'blue', 'Tunelark':'blue', 'Talerang':'blue',
 'Crunchyroll':'orange', 'SoundCloud':'orange', 'Substack':'orange', 'Trevor Project':'orange',
 'EmberAI':'purple', 'Insomnia Cookies':'purple',
};

export function projectPillColor(name:string, family?:string):ProjectPillFamily {
 return projectPillFamilies.includes(family as ProjectPillFamily)
  ? family as ProjectPillFamily : projectPillColorDefaults[name] || 'brown';
}
