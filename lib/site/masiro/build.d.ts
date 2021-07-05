import Bluebird from 'bluebird';
export declare function buildCache(force?: boolean): Bluebird<{
    id: string;
    title: string;
    cover: string;
    updated: number;
    content: string;
}[]>;
