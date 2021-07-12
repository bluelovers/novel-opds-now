/// <reference types="node" />
import { IIPFSControllerDaemon } from '../use';
import { ListenOptions } from 'net';
export declare function getPort2(options: {
    port: number;
}): Promise<number>;
export declare function findFreeAddresses(options: IIPFSControllerDaemon["opts"]): Promise<{
    Swarm: string[];
    API: string;
    Gateway: string;
}>;
export declare function isAvailablePort(options: ListenOptions | number): Promise<number>;
export declare function getUsedPorts(): number[];
