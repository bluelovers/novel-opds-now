import { RequestInit, RequestInfo, Response } from 'node-fetch';
import Bluebird from 'bluebird';
export declare function fetch(url: RequestInfo, init?: RequestInit & {
    timeout?: number;
}, ...argv: any[]): Bluebird<Response>;
export default fetch;
