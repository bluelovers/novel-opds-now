/// <reference types="node" />
import { FileTypeResult } from 'file-type';
export declare function fixFileTypeResult(result: FileTypeResult): Promise<import("file-type/core").FileTypeResult>;
export declare function mimeFromBuffer(buffer: Buffer): Promise<import("file-type/core").FileTypeResult>;
