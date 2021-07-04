import Bluebird from 'bluebird';
export declare function notAllowedAddress(url: URL | string): boolean;
export declare function getIpfsGatewayList(ipfs: any): Promise<{
    ipfsGatewayMain: string;
    ipfsGatewayList: string[];
}>;
export declare function pokeAll(cid: string, ipfs: any, options?: {
    filename?: string;
}): Bluebird<import("ts-type").ITSPromiseSettledResult<{
    href: string;
    error?: Error;
    headers?: Headers;
    status?: number;
    statusText?: string;
    value: string;
} | {
    href: string;
    error?: Error;
    headers?: Headers;
    status?: number;
    statusText?: string;
    value: false;
} | {
    href: string;
    headers?: Headers;
    status?: number;
    statusText?: string;
    value?: never;
    error: Error;
}, any>[]>;
export default pokeAll;
