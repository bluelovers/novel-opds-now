/// <reference types="node" />
import { Stream } from 'stream';
import Bluebird from 'bluebird';
export declare function streamToPromise<T>(stream: Stream): Bluebird<T>;
