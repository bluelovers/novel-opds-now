/// <reference types="lodash" />
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
export declare const cachePeersMixinFile: string;
export declare const saveMixinPeers: import("lodash").DebouncedFunc<import("lodash").DebouncedFunc<() => Bluebird<void>>>;
export declare const saveMixinPeersReduce: import("lodash").DebouncedFunc<() => Promise<void>>;
export declare function getMixinPeers(ipfs?: ITSResolvable<IUseIPFSApi>): Bluebird<string[]>;
