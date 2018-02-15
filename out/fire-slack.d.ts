import * as FirebaseFirestore from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
export interface SlackParams {
    url: string;
    channel: string;
    username?: string;
    iconEmoji?: string;
}
export declare const initialize: (adminOptions: admin.AppOptions, incomingUrl: string, options?: {
    channel?: string | undefined;
    username?: string | undefined;
    iconEmoji?: string | undefined;
} | undefined) => void;
export interface Fields {
    title: string;
    value: string;
    short?: boolean;
    title_link?: string;
    color?: string;
}
export declare const makeFirestoreUrl: (ref: FirebaseFirestore.DocumentReference) => string;
export declare const send: (message: string, options?: {
    ref?: FirebaseFirestore.DocumentReference | undefined;
    error?: Error | undefined;
    color?: string | undefined;
    channel?: string | undefined;
    overrideFields?: Fields[] | undefined;
    appendFields?: Fields[] | undefined;
} | undefined) => Promise<any>;
