import Segment, { IOptionsDoSegment } from 'novel-segment/lib/segment/core';
export declare function existsSegment(): boolean;
export declare function replaceSegmentDict(): Promise<boolean>;
export declare function getSegment(): Promise<Segment>;
export declare function doSegment(text: string, options?: IOptionsDoSegment): Promise<string>;
export default doSegment;
