import {useMemo} from 'react'
import {useFormValue, type StringInputProps} from 'sanity'

import {getCategoriesForLocale} from '../categoryOptions'

export function CategorySelectInput(props: StringInputProps) {
  const {renderDefault, schemaType, options} = props
  const localeValue = useFormValue(['locale'])
  const locale = typeof localeValue === 'string' ? localeValue : undefined
  const list = useMemo(() => getCategoriesForLocale(locale), [locale])

  const optionsWithList = useMemo(
    () => ({
      ...(options ?? {}),
      list,
    }),
    [options, list],
  )

  const schemaTypeWithList = useMemo(
    () => ({
      ...schemaType,
      options: optionsWithList,
    }),
    [schemaType, optionsWithList],
  )

  return renderDefault({...props, schemaType: schemaTypeWithList, options: optionsWithList})
}
