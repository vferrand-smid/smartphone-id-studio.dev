import {ChangeEvent, MutableRefObject, useEffect, useMemo, useState} from 'react'
import {Card, Flex, Select, Spinner, Stack, Text} from '@sanity/ui'
import {
  FormField,
  set,
  unset,
  useFormValue,
  type StringInputProps,
  type StringSchemaType,
} from 'sanity'

type AssociatedDocument = {
  id: string
  purpose?: {
    label?: string
  }
}

type DocumentAssocieInputProps = StringInputProps<StringSchemaType>

export default function DocumentAssocieInput(props: DocumentAssocieInputProps) {
  const {value, onChange} = props
  const localeValue = useFormValue(['locale'])
  const locale = typeof localeValue === 'string' && localeValue ? localeValue : 'fr-FR'
  const [documents, setDocuments] = useState<AssociatedDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const options = useMemo(() => {
    const baseOptions = documents.map((doc) => ({value: doc.id, label: doc.purpose?.label || doc.id}))
    const manualOption = {value: 'photo-identite', label: "Photo d'identité"}
    const normalizedLabel = manualOption.label.toLowerCase()
    const hasManual = baseOptions.some(
      (option) => option.value === manualOption.value || option.label.toLowerCase() === normalizedLabel,
    )
    const combined = hasManual ? baseOptions : [...baseOptions, manualOption]

    return combined
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label, locale, {sensitivity: 'base'}))
  }, [documents, locale])

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true)
      setError(null)
      try {
        const country = locale.split('-')[1]?.toUpperCase() || 'FR'
        const response = await fetch(
          `${process.env.SANITY_STUDIO_DOC_API}/price/from-country/FR/to/${country}`,
          {headers: {language: locale.split('-')[0] || 'fr'}},
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const payload = (await response.json()) as {result?: AssociatedDocument[]}
        setDocuments(Array.isArray(payload?.result) ? payload.result : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    if (locale) fetchDocs()
  }, [locale])

  const {
    elementProps: {id, onBlur, onFocus, readOnly, ref, 'aria-describedby': ariaDescribedBy},
    level,
    presence,
    schemaType,
    validation,
  } = props
  const disabled = readOnly || loading
  const currentValue = typeof value === 'string' ? value : ''

  return (
    <FormField
      title={schemaType.title}
      description={schemaType.description}
      level={level}
      __unstable_presence={presence}
      inputId={id}
      validation={validation}
    >
      <Stack space={2}>
        <Select
          id={id}
          ref={ref as MutableRefObject<HTMLSelectElement | null>}
          value={currentValue}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            const nextValue = event.currentTarget.value || undefined
            onChange(nextValue ? set(nextValue) : unset())
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
        >
          <option value="">{loading ? 'Chargement…' : '— Sélectionner —'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {loading && (
          <Flex gap={2} align="center">
            <Spinner muted size={1} />
            <Text size={1}>Nous récupérons les documents…</Text>
          </Flex>
        )}

        {error && (
          <Card padding={2} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        )}
      </Stack>
    </FormField>
  )
}
