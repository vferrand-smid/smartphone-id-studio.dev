import {useEffect, useMemo} from 'react'
import {set, useFormValue, type StringInputProps} from 'sanity'

import {getCategoriesForLocale, sanitizeCategoryValue} from '../categoryOptions'

export function CategorySelectInput(props: StringInputProps) {
  const {renderDefault, schemaType, options, value, onChange} = props
  const localeValue = useFormValue(['locale'])
  const locale = typeof localeValue === 'string' ? localeValue : undefined
  const list = useMemo(() => getCategoriesForLocale(locale), [locale])

  useEffect(() => {
    if (typeof value !== 'string' || !onChange) return
    const normalized = sanitizeCategoryValue(value)
    if (normalized && normalized !== value) {
      onChange(set(normalized))
    }
  }, [value, onChange])

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
