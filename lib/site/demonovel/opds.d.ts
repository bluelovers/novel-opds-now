export declare let prefix: string;
export declare let prefixRoot: string;
export declare let title: string;
export declare function makeOPDSType(type: string): Promise<import("opds-extra/lib/v1/core").Feed>;
export declare function makeOPDSPortal(): import("opds-extra/lib/v1/core").Feed;
export default makeOPDSPortal;
