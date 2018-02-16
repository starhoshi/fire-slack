import * as FirebaseFirestore from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as Slack from 'typed-slack';
/**
 * Initialize fire-slack in your index.ts.
 * @param adminOptions functions.config().firebase
 * @param incomingUrl Incoming webhooks url
 * @param defaultOptions defaultOptions
 */
export declare const initialize: (adminOptions: admin.AppOptions, incomingUrl: string, defaultOptions?: {
    channel?: string | undefined;
    username?: string | undefined;
    iconEmoji?: string | undefined;
} | undefined) => void;
/**
 * Make Firestore database url
 * @param ref DocumentReference
 */
export declare const makeFirestoreUrl: (ref: FirebaseFirestore.DocumentReference) => string;
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
 * @param options send options
 */
export declare const send: (options: SendOptions) => Promise<any>;
