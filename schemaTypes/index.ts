import {authorType} from './authorType'
import {externalImageType} from './externalImageType'
import link from './link'
import {pageType} from './pageType'
import blockContent from './portableTextType'
import tableOfContents from './tableOfContents'
import videoEmbed from './videoEmbed'

export const schemaTypes = [
  authorType,
  externalImageType,
  pageType,
  videoEmbed,
  link,
  tableOfContents,
  blockContent,
]
