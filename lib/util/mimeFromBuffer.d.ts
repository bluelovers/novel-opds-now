/// <reference types="node" />
import { FileTypeResult } from 'file-type';
import { FileExtension } from 'file-type/core';
import Bluebird from 'bluebird';
export declare function fixFileTypeResult(result: FileTypeResult, fileExt?: string | FileExtension): Promise<import("file-type/core").FileTypeResult>;
export declare function mimeFromBuffer(buffer: Buffer, ext?: string | FileExtension): Bluebird<import("file-type/core").FileTypeResult>;
