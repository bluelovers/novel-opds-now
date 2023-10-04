import Bluebird from 'bluebird';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
export declare function pokeAll(cid: ICIDValue, ipfs: any, options?: {
    filename?: string;
    hidden?: boolean;
    timeout?: number;
}, ...msg: any[]): Bluebird<import("ts-type").ITSPromiseSettledResult<ITSUnpackedPromiseLike<Promise<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
})>>>[]>;
export declare function reportPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>, ...msg: any): Bluebird<ITSUnpackedPromiseLike<Bluebird<import("ts-type").ITSPromiseSettledResult<ITSUnpackedPromiseLike<Promise<(Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "error"> & {
    error: Error;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: string;
}) | (Omit<import("poke-ipfs/lib/types").IPokeReturnBase, "value"> & {
    value: false;
})>>>[]>>>;
export default pokeAll;
