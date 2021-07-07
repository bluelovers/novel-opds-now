/// <reference types="node" />
export declare function mimeFromBuffer(buffer: Buffer): Promise<{
    mime: import("file-type/core").MimeType;
    ext: import("file-type/core").FileExtension;
}>;
