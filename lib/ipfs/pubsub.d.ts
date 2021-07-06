import Bluebird from 'bluebird';
import { IUseIPFSApi } from '../types';
import { Message } from 'ipfs-core-types/src/pubsub';
import CID from 'cids';
export declare function pubsubHandler(msg: Message): Promise<any>;
export declare function pubsubSubscribe(ipfs: IUseIPFSApi): Promise<void>;
export declare function pubsubUnSubscribe(ipfs: IUseIPFSApi): Promise<void>;
export declare function pubsubPublishHello(ipfs: IUseIPFSApi): Promise<void>;
export declare function pubsubPublishEpub<T extends {
    siteID: string;
    novelID: string | number;
    data: {
        path: string;
        cid: string | CID;
        size: number;
    };
}>(ipfs: IUseIPFSApi, { siteID, novelID, ...data }: T): Promise<void>;
export declare function pubsubPublish<T>(ipfs: IUseIPFSApi, data: T): Promise<void>;
export declare function getPeers(ipfs: IUseIPFSApi): Promise<string[]>;
export declare function connectPeers(ipfs: IUseIPFSApi, peerID: string): Promise<void>;
export declare function connectPeersAll(ipfs: IUseIPFSApi): Bluebird<string[]>;
