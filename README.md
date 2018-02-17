<p align="center">
    <img src="https://raw.githubusercontent.com/starhoshi/fire-slack/master/docs/logo.png" width='200px' />
</p>

# fire-slack [![npm version](https://badge.fury.io/js/fire-slack.svg)](https://badge.fury.io/js/fire-slack) [![Build Status](https://travis-ci.org/starhoshi/fire-slack.svg?branch=master)](https://travis-ci.org/starhoshi/fire-slack) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/18e7eb400ff544fb89a174782d60c531)](https://www.codacy.com/app/kensuke1751/fire-slack?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=starhoshi/fire-slack&amp;utm_campaign=Badge_Grade) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

fire-slack is a library that makes it easy and convenient to send Slack's Incoming Webhook from Cloud Functions.

The feature is below.

* Automatically add `project_id`.
* Add a link url to firebase's database. (optional)
* Add a error message and change it to red color. (optional)

## Installation

```
npm install --save fire-slack
```

## Usage

### 1. Initialize

Initialize fire-slack in your index.ts.

```ts
import * as Slack from 'fire-slack'

Slack.initialize(
    <admin.AppOptions>functions.config().firebase,
    'https://your-incoming-webhook-url',
    // optional
    { channel: 'default_channel', iconEmoji: ':default_icon_emoji:', username: 'default_username' } 
)
```

### 2. Send to slack

For example, when an error occurs on Cloud Functions.

```ts
export const orderPaymentRequested = functions.firestore
    .document(`sampleorder/{orderID}`).onCreate(async event => {

  try {
    return event.data.ref.update({ name: 'new name' })
  } catch (error) {
    // ref and error are optional.
    await Slack.send({ webhook: { text: 'An error occurred!' }, ref: event.data.ref, error: error })
    return Promise.reject(error)
  }
})
```

send's webhook options are the same as options in Incoming webhook.
See [Incoming Webhooks \| Slack](https://api.slack.com/incoming-webhooks) or [typed\-slack\.d\.ts](https://github.com/starhoshi/typed-slack/blob/master/out/typed-slack.d.ts).

