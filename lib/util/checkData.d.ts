import { IGunEpubNode } from '../types';
export declare function checkGunData(data: IGunEpubNode): data is Exclude<IGunEpubNode, {
    exists: false;
}>;
export default checkGunData;
