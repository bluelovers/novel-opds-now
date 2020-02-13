/// <reference types="node" />
export declare function startServer(options?: {
    port?: number | string;
    proxy?: string;
}): Promise<import("http").Server>;
export default startServer;
