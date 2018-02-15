import * as admin from 'firebase-admin'
import * as Slack from '../fire-slack'
import 'jest'

jest.setTimeout(20000)

beforeAll(() => {
  Slack.initialize({ projectId: 'id' },
    process.env.SLACK_URL as string,
    {
      channel: 'debug'
    }
  )
})

let user: FirebaseFirestore.DocumentReference
const id = 'test'

test('notification', async () => {
  const s = await Slack.send('test', { ref: { path: '/hoge' } as any })
  expect(s).toBe('ok')
})
