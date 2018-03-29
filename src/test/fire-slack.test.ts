import * as Slack from '../fire-slack'
import 'jest'

jest.setTimeout(20000)

const adminOptions = {
  databaseURL: 'https://sandbox-329fc.firebaseio.com',
  storageBucket: 'sandbox-329fc.appspot.com',
  apiKey: '',
  authDomain: '',
  projectId: 'sandbox-329fc'
}

beforeAll(() => {
  Slack.initialize(adminOptions,
    process.env.SLACK_URL as string,
    {
      channel: 'debug'
    }
  )
  global.process.env.FUNCTION_NAME = 'payOrder'
  global.process.env.FUNCTION_MEMORY_MB = '256'
})

let user: FirebaseFirestore.DocumentReference
const id = 'test'

describe('exist options', () => {
  test('notification', async () => {
    const s = await Slack.send({ webhook: { attachments: [{ fields: [{ title: 'custom fields', value: 'custom message', short: true }] }] }, ref: { path: 'version/1/sampleorder/3dxBtsj6d5nLujOuGu2L' } as any, error: Error('Invalid Request') })
    expect(s).toBe('ok')
  })
})

describe('exist options', () => {
  test('notification', async () => {
    const s = await Slack.send({ webhook: { text: 'hoge', attachments: [{}] }, ref: { path: 'version/1/sampleorder/3dxBtsj6d5nLujOuGu2L' } as any })
    expect(s).toBe('ok')
  })
})

describe('not exist options', () => {
  test('notification', async () => {
    const s = await Slack.send({ webhook: { text: 'hoge' } })
    expect(s).toBe('ok')
  })
})
