import * as FirebaseFirestore from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as Slack from 'typed-slack';
/**
 * Initialize fire-slack in your index.ts.
 * @param adminOptions functions.config().firebase
 * @param incomingUrl Incoming webhooks url
 * @param options options
 */
export declare const initialize: (adminOptions: admin.AppOptions, incomingUrl: string, options?: {
    channel?: string | undefined;
    username?: string | undefined;
    iconEmoji?: string | undefined;
} | undefined) => void;
/**
 * Make Firestore database url
 * @param ref DocumentReference
 */
export declare const makeFirestoreUrl: (ref: FirebaseFirestore.DocumentReference) => string;
/**
 * send to slack
 * @param message slack message
 * @param options options
 */
export declare const send: (message: string, options?: {
    ref?: FirebaseFirestore.DocumentReference | undefined;
    error?: Error | undefined;
    color?: string | undefined;
    channel?: string | undefined;
    overrideFields?: Slack.Feild[] | undefined;
    appendFields?: Slack.Feild[] | undefined;
} | undefined) => Promise<any>;
