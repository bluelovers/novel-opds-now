import createHandler from 'calibre-server/lib/handler';
import { ParsedQs } from 'qs';
import { NextFunction, ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { buildLibraryList } from 'calibre-server/lib/db/buildList';
import { pathWithPrefix } from './util';
import console from 'debug-color2/logger';
import { showClient } from '../../util/showClient';
import { Router } from 'express';
import { basename, extname, join } from 'path';
import { createReadStream } from 'fs';
import { fixFileTypeResult, mimeFromBuffer } from '../../../lib/util/mimeFromBuffer';
import { fromStream } from 'file-type';
import contentDisposition from '@lazy-http/content-disposition';
import { PassThrough } from 'stream';
import { delimiter } from 'path';
import { envCalibrePath } from 'calibre-env';

async function calibreHandlerCore()
{
	//process.env.CALIBRE_PATH = `D:\\Program Files (Portable)\\Calibre Portable`;

	let calibrePaths: string | string[] = envCalibrePath(process.env);

	if (typeof calibrePaths === 'string')
	{
		calibrePaths = calibrePaths.split(delimiter);
	}
	else
	{
		calibrePaths = [calibrePaths];
	}

	calibrePaths = calibrePaths.flat().filter(v => Boolean(v) && v !== 'undefined' && v !== 'null');

	console.debug(`[Calibre]`, `delimiter`, delimiter);
	console.debug(`[Calibre]`, `calibrePaths`, calibrePaths);

	if (!calibrePaths.length)
	{
		return (req, res, next) => {
			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.charset = 'utf-8';
			console.error(`[Calibre]`, `請使用 CALIBRE_PATH 或 --calibre-paths 來啟用 Calibre 模組`);
			res.status(404).end(`請使用 CALIBRE_PATH 或 --calibre-paths 來啟用 Calibre 模組`)
		};
	}

	const dbList = await buildLibraryList({
		calibrePaths,
		cwd: calibrePaths[0],
	});

	console.debug(`[Calibre]`, `dbList`, dbList);

	const router = Router();
	const routerOPDS = createHandler({
		dbList,
		pathWithPrefix,
		siteTitle: `Calibre 書庫`,
	});

	router.use('/opds/calibre(\.xml)?', routerOPDS)

	router.use('/file/calibre/+:dbID/*', async (req, res, next) =>
	{
		const { dbID } = req.params;

		let file: string = req.params[0];
		let db = dbList[dbID];

		if (!db)
		{
			return res.status(500).end(`${dbID} not exists`)
		}

		if (file?.length)
		{
			let ext = extname(file).toLowerCase();

			if (['.epub', '.jpg'].includes(ext))
			{
				console.log(req.method, req.baseUrl, req.url, req.params, req.query);
				showClient(req, res, next);

				let local_path = join(db?._fulldir, file);

				let result = await fromStream(createReadStream(local_path)).then(fixFileTypeResult);

				let filename = basename(file)
				let http_filename = filename;

				if (req.query.filename?.length)
				{
					http_filename = String(req.query.filename)
				}

				let attachment = contentDisposition(http_filename);

				res.set('Content-disposition', attachment);
				result?.mime && res.set('Content-Type', result.mime);

				console.debug(`[Calibre]`, {
					dbID,
					file,
					local_path,
					filename,
					http_filename,
					result,
				})

				return createReadStream(local_path).pipe(res);
			}
		}

		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.charset = 'utf-8';
		console.error(`[Calibre]`, dbID, file);
		res.status(404).end([dbID, file].join('/'))
	})

	return router
}

export default calibreHandlerCore();
