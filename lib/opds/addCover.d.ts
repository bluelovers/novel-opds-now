import { EnumLinkRel } from 'opds-extra/lib/const';
export declare function addCover(href: string): {
    rel: EnumLinkRel;
    href: string;
    type: string;
}[];
export default addCover;
