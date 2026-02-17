import {useEffect, useMemo} from 'react'
import {set, useFormValue, type StringInputProps} from 'sanity'

import {getCategoriesForLocale, sanitizeCategoryValue} from '../categoryOptions'

export function CategorySelectInput(props: StringInputProps) {
  const {renderDefault, schemaType, value, onChange} = props
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

  const schemaTypeWithList = useMemo(
    () => ({
      ...schemaType,
      options: {
        ...(schemaType.options ?? {}),
        list,
      },
    }),
    [schemaType, list],
  )

  return renderDefault({...props, schemaType: schemaTypeWithList})
}
