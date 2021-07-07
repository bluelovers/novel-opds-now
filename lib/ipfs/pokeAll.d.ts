import Bluebird from 'bluebird';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
export declare function notAllowedAddress(url: URL | string): boolean;
export declare function getIpfsGatewayList(ipfs: any): Promise<{
    ipfsGatewayMain: string;
    ipfsGatewayList: string[];
}>;
export declare function pokeAll(cid: string, ipfs: any, options?: {
    filename?: string;
}): Bluebird<import("ts-type").ITSPromiseSettledResult<{
    href: string;
    status?: number;
    statusText?: string;
    error?: Error;
    headers?: Headers;
    value: string;
} | {
    href: string;
    status?: number;
    statusText?: string;
    error?: Error;
    headers?: Headers;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    statusText?: string;
    headers?: Headers;
    error: Error;
}, any>[]>;
export declare function filterPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>): import("ts-type").ITSPromiseSettledResult<{
    href: string;
    status?: number;
    statusText?: string;
    error?: Error;
    headers?: Headers;
    value: string;
} | {
    href: string;
    status?: number;
    statusText?: string;
    error?: Error;
    headers?: Headers;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    statusText?: string;
    headers?: Headers;
    error: Error;
}, any>[];
export declare function reportPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>, ...msg: any): Bluebird<import("ts-type").ITSPromiseSettledResult<{
    href: string;
    status?: number;
    statusText?: string;
    error?: Error;
    headers?: Headers;
    value: string;
} | {
    href: string;
    status?: number;
    statusText?: string;
    error?: Error;
    headers?: Headers;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    statusText?: string;
    headers?: Headers;
    error: Error;
}, any>[]>;
export default pokeAll;
