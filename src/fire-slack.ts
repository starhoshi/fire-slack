import * as FirebaseFirestore from '@google-cloud/firestore'
import * as admin from 'firebase-admin'
import * as Slack from 'typed-slack'

let _channel: string | undefined
let _username: string | undefined
let _iconEmoji: string | undefined
let _adminOptions: admin.AppOptions
let _webhook: Slack.IncomingWebhook

/**
 * Initialize fire-slack in your index.ts.
 * @param adminOptions functions.config().firebase
 * @param incomingUrl Incoming webhooks url
 * @param defaultOptions defaultOptions
 */
export const initialize = (adminOptions: admin.AppOptions, incomingUrl: string, defaultOptions?: { channel?: string, username?: string, iconEmoji?: string }) => {
  _adminOptions = adminOptions
  _webhook = new Slack.IncomingWebhook(incomingUrl)
  if (defaultOptions) {
    _channel = defaultOptions.channel
    _username = defaultOptions.username
    _iconEmoji = defaultOptions.iconEmoji
  }
}
/**
 * Make Firestore database url
 * @param ref DocumentReference
 */
export const makeFirestoreUrl = (ref: FirebaseFirestore.DocumentReference) => {
  let databaseURL = 'https://console.firebase.google.com/u/0/project/'
  databaseURL += (_adminOptions.projectId || '/projectId') + '/database/firestore/data~2F'
  const path = ref.path.replace(/\//g, '~2F')

  return databaseURL + path
}

export interface SendOptions {
  /**
   * IncomingWebhookOptions
   */
  webhook: Slack.IncomingWebhookOptions
  /**
   * DocumentReference
   */
  ref?: FirebaseFirestore.DocumentReference
  /**
   * Set error if you want to send an error.
   */
  error?: Error
}

/**
 * Send to slack.
 * If you add error to options, automatically append error field.
 * If you add ref to options, automatically append path field and title path.
 * Even if you specify a title, ref will override it, so be careful.
 *
 * If you want to specify parameters more flexibly, please use [typed\-slack](https://github.com/starhoshi/typed-slack) directly.
 * @param options send options
 */
export const send = async (options: SendOptions) => {
  const webhookOptions = options.webhook
  webhookOptions.channel = webhookOptions.channel || _channel
  webhookOptions.icon_emoji = webhookOptions.icon_emoji || _iconEmoji
  webhookOptions.username = webhookOptions.username || _username || 'fire-slack'
  if (!webhookOptions.attachments || webhookOptions.attachments.length === 0) {
    webhookOptions.attachments = [{}]
  }
  webhookOptions.attachments[0].ts = webhookOptions.attachments[0].ts || new Date().getTime() / 1000
  webhookOptions.attachments[0].fields = webhookOptions.attachments[0].fields || []
  webhookOptions.attachments[0].fields!.push(
    { title: 'project_id', value: _adminOptions.projectId || 'Unknown', short: true }
  )

  if (options) {
    if (options.ref) {
      webhookOptions.attachments[0].title = options.ref.path
      webhookOptions.attachments[0].title_link = makeFirestoreUrl(options.ref)
    }

    if (options.error) {
      webhookOptions.attachments[0].fields!.push({ title: 'error', value: options.error.toString() })
      webhookOptions.attachments[0].color = webhookOptions.attachments[0].color || Slack.Color.Danger
    }
  }

  return _webhook.send(webhookOptions)
}
