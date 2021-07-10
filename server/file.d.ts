import { Router } from 'express';
export declare type IRouter = Router;
declare function fileHandler(): Router;
export declare function removeTempOutputDir(query: {
    debug?: boolean;
}, data: {
    outputDir: string;
    removeCallback?(): any;
}): Promise<any>;
export default fileHandler;
