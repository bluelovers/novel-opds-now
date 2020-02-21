/// <reference types="bluebird" />
import { getIPFSEpubFile, putIPFSEpubFile } from './ipfs';
export { getIPFSEpubFile as getGunEpubFile, };
export declare function getGunEpubFile2(...argv: Parameters<typeof getIPFSEpubFile>): import("bluebird")<any>;
export { putIPFSEpubFile as putGunEpubFile };
