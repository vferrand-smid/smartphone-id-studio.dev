import { createClient } from "@sanity/client";

import "dotenv/config";

// 👉 Récupère la locale passée en argument (ex: fr-FR)
const LOCALE_TO_COUNT = process.argv[2];

if (!LOCALE_TO_COUNT) {
  console.error(
    "❌ Merci de préciser une locale ! Exemple : npm run count-pages fr-FR"
  );
  process.exit(1);
}

// 👉 Configure ton client Sanity
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_STUDIO_API_TOKEN!,
});

async function countPagesDetailed(locale: string) {
  const total = await client.fetch<number>(
    `count(*[_type == "page" && locale == $locale])`,
    {
      locale,
    }
  );

  const published = await client.fetch<number>(
    `count(*[_type == "page" && locale == $locale && status == "publish"])`,
    { locale }
  );

  const draft = await client.fetch<number>(
    `count(*[_type == "page" && locale == $locale && status == "draft"])`,
    { locale }
  );

  const undefinedStatus = await client.fetch<number>(
    `count(*[_type == "page" && locale == $locale && !defined(status)])`,
    { locale }
  );

  const trashed = await client.fetch<number>(
    `count(*[_type == "page" && locale == $locale && defined(trashed)])`,
    { locale }
  );

  console.log(`📄 Statistiques pour la locale "${locale}" :`);
  console.log(`   - Total :       ${total}`);
  console.log(`   - 🟢 Published : ${published}`);
  console.log(`   - 📝 Draft :     ${draft}`);
  console.log(`   - ❓ Sans statut : ${undefinedStatus}`);
  console.log(`   - 🗑️ Trashed :    ${trashed}`);
}

countPagesDetailed(LOCALE_TO_COUNT)
  .then(() => console.log("✅ Comptage terminé."))
  .catch((err) => console.error("❌ Erreur pendant le comptage :", err));
