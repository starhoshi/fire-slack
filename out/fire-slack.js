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
 * @param defaultOptions defaultOptions
 */
exports.initialize = (adminOptions, incomingUrl, defaultOptions) => {
    _adminOptions = adminOptions;
    _webhook = new Slack.IncomingWebhook(process.env.SLACK_URL);
    if (defaultOptions) {
        _channel = defaultOptions.channel;
        _username = defaultOptions.username;
        _iconEmoji = defaultOptions.iconEmoji;
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
 * Send to slack.
 * If you add error to options, automatically append error field.
 * If you add ref to options, automatically append path field and title path.
 * Even if you specify a title, ref will override it, so be careful.
 * @param options send options
 */
exports.send = (options) => __awaiter(this, void 0, void 0, function* () {
    const webhookOptions = options.webhook;
    webhookOptions.channel = webhookOptions.channel || _channel;
    webhookOptions.icon_emoji = webhookOptions.icon_emoji || _iconEmoji;
    webhookOptions.username = webhookOptions.username || _username || 'fire-slack';
    if (!webhookOptions.attachments || webhookOptions.attachments.length === 0) {
        webhookOptions.attachments = [{}];
    }
    webhookOptions.attachments[0].ts = webhookOptions.attachments[0].ts || new Date().getTime() / 1000;
    webhookOptions.attachments[0].fields = webhookOptions.attachments[0].fields || [];
    webhookOptions.attachments[0].fields.push({ title: 'project_id', value: _adminOptions.projectId || 'Unknown', short: true });
    if (options) {
        if (options.ref) {
            webhookOptions.attachments[0].title = options.ref.path;
            webhookOptions.attachments[0].title_link = exports.makeFirestoreUrl(options.ref);
        }
        if (options.error) {
            webhookOptions.attachments[0].fields.push({ title: 'error', value: options.error.toString() });
            webhookOptions.attachments[0].color = webhookOptions.attachments[0].color || Slack.Color.Danger;
        }
    }
    return _webhook.send(webhookOptions);
});
