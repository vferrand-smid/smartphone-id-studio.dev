import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  useCdn: false,
});

export async function getLocales() {
  const query = `array::unique(*[_type == "page" && defined(locale)].locale)`;

  return await client.fetch<string[]>(query);
}
