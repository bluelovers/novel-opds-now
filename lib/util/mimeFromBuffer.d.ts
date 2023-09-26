/// <reference types="node" />
import { FileTypeResult } from 'file-type';
import { FileExtension } from 'file-type/core';
export declare function fixFileTypeResult(result: FileTypeResult, fileExt?: string | FileExtension): Promise<import("file-type/core").FileTypeResult>;
export declare function mimeFromBuffer(buffer: Buffer, ext?: string | FileExtension): Promise<import("file-type/core").FileTypeResult>;
