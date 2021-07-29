/// <reference types="node" />
import { ITSPartialRecord } from 'ts-type';
import { IUseIPFSApi } from '../types';
import { IIPFSEnv } from 'ipfs-env';
import { ChildProcess } from 'child_process';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
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
        cid: ICIDValue;
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
declare module 'ipfs-env' {
    interface IIPFSEnv {
        IPFS_DISPOSABLE?: boolean;
    }
}
export interface IIPFSControllerDaemon {
    started: boolean;
    path: string;
    api: IUseIPFSApi;
    env: IIPFSEnv;
    opts: {
        type?: 'go' | 'js' | 'proc';
        disposable: boolean;
        ipfsOptions?: {
            init?: boolean;
            config?: {
                Addresses?: {
                    Swarm?: string[];
                    API?: string;
                    Gateway?: string;
                };
            };
        };
        ipfsBin?: string;
        endpoint?: string;
    };
    disposable: boolean;
    subprocess: ChildProcess;
    init(options?: any): Promise<IIPFSControllerDaemon>;
    cleanup(): Promise<IIPFSControllerDaemon>;
    start(): Promise<IIPFSControllerDaemon>;
    stop(): Promise<IIPFSControllerDaemon>;
    version(): Promise<string>;
    pid(): Promise<string>;
    isNewRepo?: boolean;
}
export interface IUseIPFSOptions {
    disposable?: boolean;
    factoryOptions?: Record<string, any>;
    mfs?: boolean;
}
