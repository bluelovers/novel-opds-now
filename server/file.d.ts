import { Router } from 'express';
import Bluebird from 'bluebird';
export declare type IRouter = Router;
declare function fileHandler(): Router;
export declare function removeTempOutputDir(query: {
    debug?: boolean;
}, data: {
    outputDir: string;
    removeCallback?(): any;
}): Bluebird<any>;
export default fileHandler;
