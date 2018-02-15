import * as FirebaseFirestore from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
/**
 * Use for initializer.
 */
export interface SlackParams {
    url: string;
    channel: string;
    username?: string;
    iconEmoji?: string;
}
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
 * attachments.fields
 */
export interface Fields {
    title: string;
    value: string;
    short?: boolean;
}
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
    overrideFields?: Fields[] | undefined;
    appendFields?: Fields[] | undefined;
} | undefined) => Promise<any>;
