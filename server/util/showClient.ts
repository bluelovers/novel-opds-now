import { Details } from 'express-useragent';
import { Request, Response } from 'express';
import console from 'debug-color2/logger';

declare module 'express-serve-static-core'
{
	interface Request
	{
		clientIp?: string
		useragent?: Details;
	}
}

declare global {
	namespace Express {
		interface Request {
			clientIp?: string
			useragent?: Details;
		}
	}
}

export function showClient(req: Request, res: Response, ...argv: any)
{
	console.debug(`useragent`, req.useragent.source)
	console.debug(`client`, req.clientIp)
}
