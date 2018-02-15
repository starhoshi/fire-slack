"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Slack = require("typed-slack");
let _channel;
let _username;
let _iconEmoji;
let _adminOptions;
let _webhook;
/**
 * Initialize fire-slack in your index.ts.
 * @param adminOptions functions.config().firebase
 * @param incomingUrl Incoming webhooks url
 * @param options options
 */
exports.initialize = (adminOptions, incomingUrl, options) => {
    _adminOptions = adminOptions;
    _webhook = new Slack.IncomingWebhook(process.env.SLACK_URL);
    if (options) {
        _channel = options.channel;
        _username = options.username;
        _iconEmoji = options.iconEmoji;
    }
};
/**
 * Make Firestore database url
 * @param ref DocumentReference
 */
exports.makeFirestoreUrl = (ref) => {
    let databaseURL = 'https://console.firebase.google.com/u/0/project/';
    databaseURL += (_adminOptions.projectId || '/projectId') + '/database/firestore/data~2F';
    const path = ref.path.replace(/\//g, '~2F');
    return databaseURL + path;
};
/**
 * send to slack
 * @param message slack message
 * @param options options
 */
exports.send = (message, options) => __awaiter(this, void 0, void 0, function* () {
    let color = undefined;
    let channel = _channel;
    let iconEmoji = _iconEmoji;
    let title = undefined;
    let firURL = undefined;
    let fields = [
        { title: 'project_id', value: _adminOptions.projectId || 'Unknown', short: true }
    ];
    if (options) {
        if (options.ref) {
            firURL = exports.makeFirestoreUrl(options.ref);
            title = options.ref.path;
        }
        if (options.error) {
            fields.push({ title: 'error', value: options.error.toString() });
            color = Slack.Color.Danger;
        }
        if (options.color) {
            color = options.color;
        }
        if (options.overrideFields) {
            fields = options.overrideFields;
        }
        else if (options.appendFields) {
            fields.concat(options.appendFields);
        }
        if (options.channel) {
            channel = options.channel;
        }
    }
    const attachments = {
        title: title,
        title_link: firURL,
        color: color,
        ts: new Date().getTime() / 1000,
        fields: fields
    };
    const webhookOptions = {
        channel: channel,
        icon_emoji: iconEmoji,
        username: _username || 'fire-slack',
        text: message,
        attachments: [attachments]
    };
    return _webhook.send(webhookOptions);
});
