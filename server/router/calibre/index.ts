import { RequestHandler } from 'express-serve-static-core';
import console from 'debug-color2/logger';

export let calibreHandler: RequestHandler = (req, res, next) => {
	if (/^\/(file|opds)\/(calibre)/.test(req.url))
	{
		return import('./core').then(m => m.default).then(m => m(req, res, next));
	}
	else
	{
		next();
	}
};

export default calibreHandler
