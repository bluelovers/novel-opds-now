import { ITSPartialRecord } from 'ts-type';
import CID from 'cids';
export declare type IFill<T, U> = T & ITSPartialRecord<Exclude<keyof U, keyof T>, void>;
export declare type IOr<A extends any[]> = A extends [infer T1, infer T2] ? IFill<T1, T2> | IFill<T2, T1> : A extends [infer T1, infer T2, infer T3] ? IFill<T1, T2 & T3> | IFill<T2, T1 & T3> | IFill<T3, T1 & T2> : never;
export interface IPubSubBase {
    peers?: string[];
}
export interface IPubSubEpub extends IPubSubBase {
    siteID: string;
    novelID: string | number;
    data: {
        path: string;
        cid: string | CID;
        size: number;
    };
}
export declare enum EnumPubSubHello {
    HELLO = 1,
    HELLO_AGAIN = 2,
    HELLO_REPLY = 3
}
export interface IPubSubHello extends IPubSubBase {
    peerID: string;
    type: EnumPubSubHello;
}
