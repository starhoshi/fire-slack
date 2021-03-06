import * as Slack from 'typed-slack'

let _channel: string | undefined
let _username: string | undefined
let _iconEmoji: string | undefined
let _firebaseConfig: { [id: string]: string }
let _webhook: Slack.IncomingWebhook

/**
 * Initialize fire-slack in your index.ts.
 * @param adminOptions functions.config().firebase
 * @param incomingUrl Incoming webhooks url
 * @param defaultOptions defaultOptions
 */
export const initialize = (incomingUrl: string, defaultOptions?: { channel?: string, username?: string, iconEmoji?: string }) => {
  _firebaseConfig = JSON.parse(global.process.env.FIREBASE_CONFIG as string)
  _webhook = new Slack.IncomingWebhook(incomingUrl)
  if (defaultOptions) {
    _channel = defaultOptions.channel
    _username = defaultOptions.username
    _iconEmoji = defaultOptions.iconEmoji
  }
}

const baseURL = 'https://console.firebase.google.com/u/0/project/'

/**
 * Make Firestore database url
 * @param ref DocumentReference
 */
export const makeFirestoreURL = (ref: { path: string }) => {
  const databaseURL = baseURL + (_firebaseConfig.projectId || '/projectId') + '/database/firestore/data~2F'
  const path = ref.path.replace(/\//g, '~2F')

  return databaseURL + path
}

/**
 * Make Cloud Functions log url
 */
export const makeFunctionsLogURL = (functionName: string) => {
  const url = baseURL + (_firebaseConfig.projectId || '/projectId') + '/functions/logs'
  return `${url}?search=${functionName}`
}

/**
 * Make Stackdriver log url
 */
export const makeStackdriverURL = (functionName: string) => {
  let stackdriver = `https://console.cloud.google.com/logs/viewer?project=${_firebaseConfig.projectId}`
  stackdriver += `&advancedFilter=resource.type%3D"cloud_function"%0Aresource.labels.function_name%3D"${functionName}"`
  return stackdriver
}

export interface SendOptions {
  /**
   * IncomingWebhookOptions
   */
  webhook: Slack.IncomingWebhookOptions
  /**
   * DocumentReference
   */
  ref?: { path: string }
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

  if (global.process.env.K_SERVICE) {
    const functionName = global.process.env.K_SERVICE
    let value = global.process.env.K_SERVICE
    if (global.process.env.FUNCTION_MEMORY_MB) {
      value += ` (${global.process.env.FUNCTION_MEMORY_MB} MB)`
    }

    webhookOptions.attachments[0].fields!.push(
      { title: 'Function Name', value: value, short: true }
    )

    let message = `You can refer to the \`${functionName}\`'s logs in`
    message += ` <${makeFunctionsLogURL(functionName)}|Firebase>`
    message += ` or <${makeStackdriverURL(functionName)}|Stackdriver.>`
    if (webhookOptions.text) {
      webhookOptions.text += `\n${message}`
    } else {
      webhookOptions.text = message
    }
  }

  webhookOptions.attachments[0].fields!.push(
    { title: 'Project ID', value: _firebaseConfig.projectId || 'Unknown', short: true }
  )

  if (options) {
    if (options.ref) {
      webhookOptions.attachments[0].title = options.ref.path
      webhookOptions.attachments[0].title_link = makeFirestoreURL(options.ref)
    }

    if (options.error) {
      webhookOptions.attachments[0].fields!.push({ title: 'Error', value: options.error.toString() })
      webhookOptions.attachments[0].color = webhookOptions.attachments[0].color || Slack.Color.Danger
    }
  }

  return _webhook.send(webhookOptions)
}
