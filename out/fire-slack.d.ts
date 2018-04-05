import * as FirebaseFirestore from '@google-cloud/firestore';
import * as Slack from 'typed-slack';
/**
 * Initialize fire-slack in your index.ts.
 * @param adminOptions functions.config().firebase
 * @param incomingUrl Incoming webhooks url
 * @param defaultOptions defaultOptions
 */
export declare const initialize: (incomingUrl: string, defaultOptions?: {
    channel?: string | undefined;
    username?: string | undefined;
    iconEmoji?: string | undefined;
} | undefined) => void;
/**
 * Make Firestore database url
 * @param ref DocumentReference
 */
export declare const makeFirestoreURL: (ref: FirebaseFirestore.DocumentReference) => string;
/**
 * Make Cloud Functions log url
 */
export declare const makeFunctionsLogURL: (functionName: string) => string;
/**
 * Make Stackdriver log url
 */
export declare const makeStackdriverURL: (functionName: string) => string;
export interface SendOptions {
    /**
     * IncomingWebhookOptions
     */
    webhook: Slack.IncomingWebhookOptions;
    /**
     * DocumentReference
     */
    ref?: FirebaseFirestore.DocumentReference;
    /**
     * Set error if you want to send an error.
     */
    error?: Error;
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
export declare const send: (options: SendOptions) => Promise<any>;
