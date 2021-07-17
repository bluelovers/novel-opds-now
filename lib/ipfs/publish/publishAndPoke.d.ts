/// <reference types="node" />
import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
export declare function publishAndPokeIPFS(content: ITSResolvable<Buffer>, options?: {
    ipfs?: ITSResolvable<IUseIPFSApi>;
    timeout?: number;
    filename?: string;
    hidden?: boolean;
    cb?(cid: string, ipfs: IUseIPFSApi, data: {
        filename: string;
    }): ITSResolvable<any>;
    noPoke?: boolean;
}, ...msg: any): Bluebird<import("fetch-ipfs/lib/put/types").IPublishToIPFSReturn>;
