import * as FirebaseFirestore from '@google-cloud/firestore'
import * as rp from 'request-promise'
import * as admin from 'firebase-admin'

export interface SlackParams {
  url: string
  channel: string
  username?: string
  iconEmoji?: string
}

let _url: string = ''
let _channel: string | undefined
let _username: string | undefined
let _iconEmoji: string | undefined
let _adminOptions: admin.AppOptions

export const initialize = (adminOptions: admin.AppOptions, incomingUrl: string, options?: { channel?: string, username?: string, iconEmoji?: string }) => {
  _adminOptions = adminOptions
  _url = incomingUrl
  if (options) {
    _channel = options.channel
    _username = options.username
    _iconEmoji = options.iconEmoji
  }
}

export interface Fields {
  title: string
  value: string
  short?: boolean
  title_link?: string
  color?: string
}

export const makeFirestoreUrl = (ref: FirebaseFirestore.DocumentReference) => {
 let databaseURL = 'https://console.firebase.google.com/u/0/project/'
  databaseURL +=  (_adminOptions.projectId || '/projectId') + '/database/firestore/data~2F'
  const path = ref.path.replace(/\//g, '~2F')

  return databaseURL + path
}

export const send = async (message: string, options?: { ref?: FirebaseFirestore.DocumentReference, error?: Error, color?: string, channel?: string, overrideFields?: Fields[], appendFields?: Fields[] }) => {
  let color: string | undefined = undefined
  let channel: string | undefined = _channel
  let title: string | undefined = undefined
  let firURL: string | undefined = undefined
  let fields: Fields[] = [
    { title: 'project_id', value: _adminOptions.projectId || 'Unknown', short: true }
  ]

  if (options) {
    if (options.ref) {
      firURL = makeFirestoreUrl(options.ref)
      title = options.ref.path
    }

    if (options.error) {
      fields.push({ title: 'error', value: options.error.toString() })
      color = 'danger'
    }

    if (options.color) {
      color = options.color
    }

    if (options.overrideFields) {
      fields = options.overrideFields
    } else if (options.appendFields) {
      fields.concat(options.appendFields)
    }

    if (options.channel) {
      channel = options.channel
    }
  }

  const attachments = {
    title: title,
    title_link: firURL,
    color: (options || {}).color,
    ts: new Date().getTime() / 1000,
    fields: fields
  }

  return rp({
    method: 'POST',
    uri: _url,
    body: {
      channel: channel,
      icon_emoji: _iconEmoji,
      username: _username || 'fire-slack',
      text: message,
      attachments: [attachments]
    },
    json: true
  })
}
