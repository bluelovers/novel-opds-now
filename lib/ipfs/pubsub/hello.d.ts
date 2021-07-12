import { IUseIPFSApi } from '../../types';
import { EnumPubSubHello } from '../types';
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
export declare function pubsubPublishHello(ipfs: IUseIPFSApi, helloType?: EnumPubSubHello, peers?: ITSResolvable<string[]>): Bluebird<void>;
