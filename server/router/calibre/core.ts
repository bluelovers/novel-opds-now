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
import { fromBuffer, fromStream } from 'file-type';
import contentDisposition from '@lazy-http/content-disposition';
import { PassThrough } from 'stream';
import { delimiter } from 'path';
import { envCalibrePath } from 'calibre-env';
import { publishToIPFSAll } from 'fetch-ipfs/put';
import { filterList } from 'ipfs-server-list';
import { readFile } from 'fs-extra';
import { responseStream } from 'http-response-stream';
import { getIPFS } from '../../../lib/ipfs/use';
import { pokeAll, reportPokeAllSettledResult } from '../../../lib/ipfs/pokeAll';
import { IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';
import { publishAndPokeIPFS } from '../../../lib/ipfs/publish/publishAndPoke';
import { IUseIPFSApi } from '../../../lib/types';
import { _addMutableFileSystem, waitingCache } from '../../../lib/ipfs/mfs/_addMutableFileSystem';
import { sanitizeFilename } from '@lazy-node/sanitize-filename';
import { pokeMutableFileSystemCore } from '../../../lib/ipfs/mfs/pokeMutableFileSystem';
import { saveMutableFileSystemRoots } from '../../../lib/ipfs/mfs/saveMutableFileSystemRoots';
import { getPubsubPeers, pubsubPublishEpub } from '../../../lib/ipfs/pubsub/index';
import { isBookFile } from 'calibre-server/lib/util/isBookFile';

async function calibreHandlerCore(): Promise<Router>
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
		// @ts-ignore
		return (req, res, next) =>
		{
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

			if (['.epub', '.jpg'].includes(ext) || isBookFile(ext.replace(/^\./, '')))
			{
				console.log(req.method, req.baseUrl, req.url, req.params, req.query);
				showClient(req, res, next);

				let local_path = join(db?._fulldir, file);

				let content = await readFile(local_path);

				let result = await mimeFromBuffer(content, ext);

				let filename = basename(file)

				let http_filename = filename;

				if (req.query.filename?.length)
				{
					http_filename = basename(String(req.query.filename))
				}

				let attachment = contentDisposition(http_filename);

				try
				{
					res.set('Content-disposition', attachment);
				}
				catch (e)
				{}

				result?.mime && res.set('Content-Type', result.mime);

				console.debug(`[Calibre]`, {
					dbID,
					file,
					local_path,
					filename,
					http_filename,
					result,
				})

				if (['.epub', '.jpg'].includes(ext) || isBookFile(result.ext))
				{
					const siteID = 'calibre' as const;

					publishAndPokeIPFS(content, {
						filename: http_filename,
						//noPoke: true,
						cb(cid: string, ipfs: IUseIPFSApi, data: { filename: string }, result)
						{
							let author = sanitizeFilename(req.query?.author as string || 'unknown', {
								replaceToFullWidth: true,
							}) || 'unknown';

							ipfs && pubsubPublishEpub(ipfs, {
								siteID,
								novelID: `${dbID}/${author}`,
								data: {
									path: result.path,
									cid,
									size: result.size,
								},
							}, getPubsubPeers(ipfs));

							ipfs && _addMutableFileSystem(`/novel-opds-now/${siteID}/${dbID}/${author}`, {
								path: sanitizeFilename(http_filename, {
									replaceToFullWidth: true,
								}) || sanitizeFilename(filename, {
									replaceToFullWidth: true,
								}),
								cid,
							}, {
								ipfs,
								async done(file_path)
								{
									await saveMutableFileSystemRoots(ipfs);

									waitingCache.delete(file_path)
									console.debug(`_addMutableFileSystem:done`, file_path)

									return pokeMutableFileSystemCore(http_filename, [
										`${siteID}/${dbID}/${author}/`,
										`${siteID}/${dbID}/`,
										`${siteID}/`,
									]);
								},
							})
								.catch(e => console.error(`_addMutableFileSystem`, http_filename, e))
						},
					})
						.catch(e => console.error(`publishAndPokeIPFS`, http_filename, e))
				}

				return responseStream(res, content);
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
