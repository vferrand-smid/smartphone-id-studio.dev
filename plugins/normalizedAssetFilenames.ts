import {definePlugin, DocumentActionComponent, DocumentActionProps} from 'sanity'
import type {SanityClient} from '@sanity/client'
import {normalizeAssetFilename} from '../migrations/lib/normalizeAssetFilename'

type AssetDocument = {
  _id: string
  originalFilename?: string
  extension?: string
}

type DocumentActionPropsWithClient = DocumentActionProps & {
  getClient: (options: {apiVersion: string}) => SanityClient
}

async function normalizeAssetFilenamesForDocument(props: DocumentActionPropsWithClient) {
  const draft = props.draft
  const published = props.published
  const documentValue = draft || published

  if (!documentValue) return

  const assetRefs = collectImageAssetRefs(documentValue)
  if (!assetRefs.length) return

  const slugPrefix =
    typeof (documentValue as any)?.slug?.current === 'string'
      ? (documentValue as any).slug.current
      : undefined

  const client = props.getClient({apiVersion: '2024-10-01'})

  const operations = assetRefs.map(async (assetId) => {
    try {
      const asset = await client.fetch<AssetDocument | null>(
        `*[_id == $id][0]{_id, originalFilename, extension}`,
        {id: assetId},
      )

      if (!asset?._id) return

      const extension = asset.extension ? `.${asset.extension}` : undefined
      const desiredFilename = normalizeAssetFilename({
        originalName: asset.originalFilename,
        prefix: slugPrefix,
        defaultExtension: extension,
      })

      if (!desiredFilename || desiredFilename === asset.originalFilename) {
        return
      }

      await client.patch(asset._id).set({originalFilename: desiredFilename}).commit({
        visibility: 'async',
      })
    } catch (err) {
      console.warn(
        '[normalizeAssetFilenames] Unable to normalize asset',
        assetId,
        (err as Error)?.message || err,
      )
    }
  })

  await Promise.all(operations)
}

function collectImageAssetRefs(value: unknown): string[] {
  const results = new Set<string>()

  function visit(node: unknown) {
    if (!node) return

    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }

    if (typeof node !== 'object') {
      return
    }

    const candidate = node as Record<string, unknown>
    const isImage = candidate._type === 'image'
    const assetRef = isImage ? (candidate.asset as Record<string, unknown> | undefined)?._ref : undefined

    if (typeof assetRef === 'string' && assetRef) {
      results.add(assetRef)
    }

    for (const key of Object.keys(candidate)) {
      visit(candidate[key])
    }
  }

  visit(value)

  return Array.from(results)
}

function wrapPublishAction(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  const WrappedAction: DocumentActionComponent = (props) => {
    const result = originalAction(props)
    if (!result) return result

    const originalHandle = result.onHandle

    return {
      ...result,
      onHandle: async () => {
        try {
          await normalizeAssetFilenamesForDocument(props as DocumentActionPropsWithClient)
        } catch (err) {
          console.warn(
            '[normalizeAssetFilenames] Unexpected error while normalizing assets',
            (err as Error)?.message || err,
          )
        } finally {
          originalHandle?.()
        }
      },
    }
  }

  WrappedAction.action = originalAction.action
  WrappedAction.displayName = originalAction.displayName ?? originalAction.action ?? 'publish'

  return WrappedAction
}

export const normalizedAssetFilenamesPlugin = definePlugin({
  name: 'normalized-asset-filenames',
  document: {
    actions: (prev) =>
      prev.map((action) => {
        if (action.action === 'publish') {
          return wrapPublishAction(action)
        }
        return action
      }),
  },
})
