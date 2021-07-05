import { Details } from 'express-useragent';
import { Request, Response } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
        clientIp?: string;
        useragent?: Details;
    }
}
declare global {
    namespace Express {
        interface Request {
            clientIp?: string;
            useragent?: Details;
        }
    }
}
export declare function showClient(req: Request, res: Response, ...argv: any): void;
