import {defineArrayMember} from 'sanity'

defineArrayMember({
  type: 'block',
  marks: {
    decorators: [
      {
        title: 'Highlight',
        value: 'highlight',
        component: (props) => (
          <span style={{backgroundColor: '#0f0'}}>
            {props.children}
          </span>
        ),
        icon: BulbOutlineIcon,
      },
    ],
  },
})