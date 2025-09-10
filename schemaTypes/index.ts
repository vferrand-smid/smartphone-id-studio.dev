import {authorType} from './authorType'
import {cellRichText} from './cellRichText'
import {externalImageType} from './externalImageType'
import link from './link'
import {pageType} from './pageType'
import legalPage from './legalPage'
import blockContent from './portableTextType'
import {tableCustom} from './tableCustom'
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
  cellRichText,
  tableCustom,
  legalPage,
]
