import { IIPFSControllerDaemon, IUseIPFSOptions } from '../types';
export declare function daemonFactory(disposable: boolean, options?: IUseIPFSOptions): Promise<{
    myFactory: import("ipfsd-ctl/dist/src/types").Factory;
    ipfsd: IIPFSControllerDaemon;
}>;
