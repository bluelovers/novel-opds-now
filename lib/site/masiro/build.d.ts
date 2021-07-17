import Bluebird from 'bluebird';
import { INovelDataSimple } from '../cached-data/types';
export declare function buildCache(force: boolean): Bluebird<INovelDataSimple[]>;
