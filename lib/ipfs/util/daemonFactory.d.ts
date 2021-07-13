import { IIPFSControllerDaemon } from '../types';
export declare function daemonFactory(disposable: boolean, options?: {
    disposable?: boolean;
}): Promise<{
    myFactory: {
        opts: IIPFSControllerDaemon["opts"];
        spawn(): IIPFSControllerDaemon;
    };
    ipfsd: IIPFSControllerDaemon;
}>;
