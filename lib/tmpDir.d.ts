import { DirOptions } from 'tmp';
export declare function tmpPath(): string;
export declare function tmpDir(outputDir?: string, options?: DirOptions): import("tmp").DirResult;
export default tmpDir;
