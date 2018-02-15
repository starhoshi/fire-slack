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
// import * as Slack from 'slack-node'
const rp = require("request-promise");
let _url = '';
let _channel = '';
let _username;
let _iconEmoji;
let _adminOptions;
exports.initialize = (adminOptions, url, channel, options) => {
    _adminOptions = adminOptions;
    _url = url;
    _channel = channel;
    if (options) {
        _username = options.username;
        _iconEmoji = options.iconEmoji;
    }
};
exports.postError = (message, options) => __awaiter(this, void 0, void 0, function* () {
    let color = undefined;
    let fields = [
        { title: 'project_id', value: _adminOptions.projectId || 'Unknown', short: true }
    ];
    if (options) {
        if (options.ref) {
            fields.push({ title: 'path', value: options.ref.path });
        }
        if (options.error) {
            fields.push({ title: 'error', value: options.error.toString() });
            color = 'danger';
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
    }
    const attachments = {
        color: (options || {}).color,
        ts: new Date().getTime() / 1000,
        fields: fields
    };
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
    });
});
