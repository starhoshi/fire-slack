import * as FirebaseFirestore from '@google-cloud/firestore';
export interface SlackParams {
    url: string;
    channel: string;
    username?: string;
    iconEmoji?: string;
}
export declare const initialize: (adminOptions: any, url: string, channel: string, options?: {
    username?: string | undefined;
    iconEmoji?: string | undefined;
} | undefined) => void;
export interface Fields {
    title: string;
    value: string;
    short?: boolean;
}
export declare const postError: (message: string, options?: {
    ref?: FirebaseFirestore.DocumentReference | undefined;
    error?: Error | undefined;
    color?: string | undefined;
    overrideFields?: Fields[] | undefined;
    appendFields?: Fields[] | undefined;
} | undefined) => Promise<any>;
