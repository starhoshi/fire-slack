import * as FirebaseFirestore from '@google-cloud/firestore'
import * as rp from 'request-promise'

export interface SlackParams {
  url: string
  channel: string
  username?: string
  iconEmoji?: string
}

let _url: string = ''
let _channel: string = ''
let _username: string | undefined
let _iconEmoji: string | undefined
let _adminOptions: any

export const initialize = (adminOptions: any, url: string, channel: string, options?: { username?: string, iconEmoji?: string }) => {
  _adminOptions = adminOptions
  _url = url
  _channel = channel
  if (options) {
    _username = options.username
    _iconEmoji = options.iconEmoji
  }
}

export interface Fields {
  title: string
  value: string
  short?: boolean
}

export const postError = async (message: string, options?: { ref?: FirebaseFirestore.DocumentReference, error?: Error, color?: string, overrideFields?: Fields[], appendFields?: Fields[] }) => {
  let color: string | undefined = undefined
  let fields: Fields[] = [
    { title: 'project_id', value: _adminOptions.projectId || 'Unknown', short: true }
  ]

  if (options) {
    if (options.ref) {
      fields.push({ title: 'path', value: options.ref.path })
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
  }

  const attachments = {
    color: (options || {}).color,
    ts: new Date().getTime() / 1000,
    fields: fields
  }

  return rp({
    method: 'POST',
    uri: _url,
    body: {
      channel: _channel,
      icon_emoji: _iconEmoji,
      username: _username || 'fire-slack',
      text: message,
      attachments: [attachments]
    },
    json: true
  })
}
