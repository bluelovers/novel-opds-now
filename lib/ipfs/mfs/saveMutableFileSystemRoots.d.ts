/// <reference types="lodash" />
import { IUseIPFSApi } from '../../types';
export declare function _saveMutableFileSystemRoots(ipfs: IUseIPFSApi): Promise<any>;
export declare const saveMutableFileSystemRoots: import("lodash").DebouncedFunc<typeof _saveMutableFileSystemRoots>;
