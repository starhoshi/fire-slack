import * as admin from 'firebase-admin'
import * as Slack from '../fire-slack'
import 'jest'

jest.setTimeout(20000)

const adminOptions = <admin.AppOptions> {
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
})

let user: FirebaseFirestore.DocumentReference
const id = 'test'

describe('exist options', () => {
  test('notification', async () => {
    const s = await Slack.send('test', { ref: { path: 'version/1/sampleorder/3dxBtsj6d5nLujOuGu2L' } as any })
    expect(s).toBe('ok')
  })
})

describe('not exist options', () => {
  test('notification', async () => {
    const s = await Slack.send('test')
    expect(s).toBe('ok')
  })
})