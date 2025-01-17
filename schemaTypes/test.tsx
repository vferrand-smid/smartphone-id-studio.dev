import {defineArrayMember} from 'sanity'
import {Card, Text} from '@sanity/ui'

export const test = defineArrayMember({
  name: 'content',
  type: 'block',
  styles: [
    {
      title: 'Section Header',
      value: 'sectionHeader',
      component: (props) => (
        <Card paddingBottom={4}>
          <Text size={4} weight="bold">
            {props.children}
          </Text>
        </Card>
      ),
    },
  ],
})