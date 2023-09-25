import Bluebird from 'bluebird';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
export declare function pokeAll(cid: ICIDValue, ipfs: any, options?: {
    filename?: string;
    hidden?: boolean;
    timeout?: number;
}, ...msg: any[]): Bluebird<import("ts-type").ITSPromiseSettledResult<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
})>[]>;
export declare function reportPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>, ...msg: any): Bluebird<import("ts-type").ITSPromiseSettledResult<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
})>[]>;
export default pokeAll;
