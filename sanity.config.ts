import {colorInput} from '@sanity/color-input'
import {visionTool} from '@sanity/vision'
import {defineConfig, SchemaTypeDefinition} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import './styles/global.css'

console.log('SANITY_PROJECT_ID:', process.env.SANITY_STUDIO_PROJECT_ID)
console.log('SANITY_DATASET:', process.env.SANITY_STUDIO_DATASET)
console.log('SANITY_API_TOKEN:', process.env.SANITY_STUDIO_API_TOKEN)
console.log('SANITY_STUDIO_PREVIEW_URL:', process.env.SANITY_STUDIO_PREVIEW_URL)

export default defineConfig({
  name: 'default',
  title: process.env.SANITY_STUDIO_TITLE,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    colorInput(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL!,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    structureTool({structure}),
    visionTool(),
  ],
  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
  studio: {},
})
