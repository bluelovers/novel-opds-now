/// <reference types="lodash" />
import { IPFS } from 'ipfs-core-types';
import { ITSResolvable } from 'ts-type/lib/generic';
export declare const pokeRoot: import("lodash").DebouncedFunc<(ipfs?: ITSResolvable<IPFS>) => Promise<void>>;
