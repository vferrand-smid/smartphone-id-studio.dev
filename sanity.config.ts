import {visionTool} from '@sanity/vision'
import {defineConfig, SchemaTypeDefinition} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

import './styles/global.css'

export default defineConfig({
  name: 'default',
  title: 'smartphone-id.dev',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    structureTool({structure}),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_API_TOKEN,
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
  studio: {},
})
