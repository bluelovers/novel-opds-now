import Bluebird from 'bluebird';
export declare const globalWaiting: Map<any, Promise<any>>;
export declare function newWaitingPromise<T>(waitingKey: any, fn: (() => Promise<T>)): Bluebird<T>;
export declare function resolveWaiting<T>(waitingKey: any): Bluebird<T>;
