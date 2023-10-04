import { IPubSubEpub } from '../types';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { ITSPromiseSettledResult } from 'ts-type';
export declare function pokeMutableFileSystem(options: IPubSubEpub, title: string, ...msg: any[]): Bluebird<ITSPromiseSettledResult<ITSUnpackedPromiseLike<Promise<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
})>>>[][][]>;
export declare function pokeMutableFileSystemCore(title: string, paths: string[], ...msg: any[]): Bluebird<ITSPromiseSettledResult<ITSUnpackedPromiseLike<Promise<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
})>>>[][][]>;
export declare function _pokeMutableFileSystem(ipfs: IUseIPFSApi, path: string, title?: string): Bluebird<ITSPromiseSettledResult<ITSUnpackedPromiseLike<Promise<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
})>>>[][]>;
