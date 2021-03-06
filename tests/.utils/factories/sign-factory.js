import Sign from '~/models/Sign.js'
import faker from 'faker'

const plain = props =>
  Object.assign(
    {
      sign_id: faker.random.uuid(),
      id: faker.random.uuid(),
      sign: faker.random.word()[0],

      // characteristics
      readability: faker.random.word(),
      break_type: faker.random.word(),
      is_reconstructed: faker.random.boolean(),
      is_variant: faker.random.uuid(),
      is_retraced: faker.random.uuid(),
      is_whitespace: faker.random.uuid(),

      // position in stream info

      // > peers
      prev_sign_id: faker.random.uuid(),
      next_sign_id: faker.random.uuid(),

      // > col
      col_name: faker.random.word(),
      col_id: faker.random.uuid(),

      // > line
      line_name: faker.random.word(),
      line_id: faker.random.uuid(),
    },
    props
  )

const model = props => new Sign(plain(props))

export default { plain, model }
