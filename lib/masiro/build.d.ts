import Bluebird from 'bluebird';
export declare function buildCache(): Bluebird<{
    id: string;
    title: string;
}[]>;
