/// <reference types="node" />
import Signals = NodeJS.Signals;
export declare function processListener(eventName: Signals, fn: (...argv: any[]) => any): {
    eventName: Signals;
    cb: (...argv: any[]) => any;
    fn: (...argv: any[]) => any;
};
export declare function processExit(stop: (...argv: any[]) => any): void;
export default processExit;
