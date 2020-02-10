import Bluebird from 'bluebird';
export declare function retryGunNode<T>(gunNode: any, maxRetryAttempts?: number): Bluebird<T>;
export default retryGunNode;
