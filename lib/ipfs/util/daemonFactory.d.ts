import { IIPFSControllerDaemon, IUseIPFSOptions } from '../types';
export declare function daemonFactory(disposable: boolean, options?: IUseIPFSOptions): Promise<{
    myFactory: {
        opts: IIPFSControllerDaemon["opts"];
        spawn(): IIPFSControllerDaemon;
    };
    ipfsd: IIPFSControllerDaemon;
}>;
