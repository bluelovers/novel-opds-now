import { OPDSV1 } from 'opds-extra';
export declare let prefix: string;
export declare let prefixRoot: string;
export declare let title: string;
export declare function makeOPDSType(type: string): Promise<OPDSV1.Feed>;
export declare function makeOPDSPortal(): OPDSV1.Feed;
export default makeOPDSPortal;
