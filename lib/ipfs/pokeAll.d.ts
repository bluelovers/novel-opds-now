import Bluebird from 'bluebird';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
export declare function notAllowedAddress(url: URL | string): boolean;
export declare function getIpfsGatewayList(ipfs: any): Promise<{
    ipfsGatewayMain: string;
    ipfsGatewayList: string[];
}>;
export declare function pokeAll(cid: string, ipfs: any, options?: {
    filename?: string;
    hidden?: boolean;
}): Bluebird<import("ts-type").ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    headers?: Headers;
    statusText?: string;
    error: Error;
}, any>[]>;
export declare function filterPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>): import("ts-type").ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    headers?: Headers;
    statusText?: string;
    error: Error;
}, any>[];
export declare function reportPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>, ...msg: any): Bluebird<import("ts-type").ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    status?: number;
    headers?: Headers;
    statusText?: string;
    value: false;
} | {
    href: string;
    value?: never;
    status?: number;
    headers?: Headers;
    statusText?: string;
    error: Error;
}, any>[]>;
export default pokeAll;
