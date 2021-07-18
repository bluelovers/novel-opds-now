import { Router } from 'express';
import { IRouter } from '../../file';
import { getNovelData } from '../../../lib/site/cached-data/getNovelData';
import { siteID } from '../../../lib/site/demonovel/types';
import { getDemoEpubUrl } from '../../../lib/site/demonovel/getDemoEpubUrl';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import { getIPFSEpubFile } from '../../../lib/store/ipfs';
import { downloadEpubRace } from '../../../lib/store/downloadEpubRace';
import { fetchEpub } from '../../../lib/store/fetch/fetchEpub';
import { mimeFromBuffer } from '../../../lib/util/mimeFromBuffer';
import { basename } from 'path';
import contentDisposition from '@lazy-http/content-disposition';
import { publishAndPokeIPFS } from '../../../lib/ipfs/publish/publishAndPoke';
import { IUseIPFSApi } from '../../../lib/types';
import { sanitizeFilename } from '@lazy-node/sanitize-filename';
import { _addMutableFileSystem, waitingCache } from '../../../lib/ipfs/mfs/_addMutableFileSystem';
import { saveMutableFileSystemRoots } from '../../../lib/ipfs/mfs/saveMutableFileSystemRoots';
import { pokeMutableFileSystemCore } from '../../../lib/ipfs/mfs/pokeMutableFileSystem';
import { responseStream } from 'http-response-stream';
import { putEpubFileInfo } from '../../../lib/ipfs/index';
import { toLink } from 'to-ipfs-url';

export function demoNovelFileHandler()
{
	const router: IRouter = Router();

	router.use('/:uuid/*', (req, res) =>
	{
		return Bluebird.resolve()
			.then(async () =>
			{
				const uuid = req.params.uuid;
				const novel = await getNovelData(siteID, uuid);

				if (!novel?.cache?.epub_basename?.length)
				{
					throw new Error(`${uuid} not exists`)
				}

				const url = getDemoEpubUrl(novel);

				console.info(`檢查是否存在緩存...`, siteID, novel.id, url.href);

				const gunData = await getIPFSEpubFile(siteID, novel.id, {
						query: req.query,
					})
						.then(async (gunData) =>
						{
							if (!gunData?.exists)
							{
								gunData = {
									filename: novel.cache.epub_basename,
									exists: true,
									timestamp: novel.cache.epub_date,
									href: url.href,
									isGun: true,
									base64: void 0,
								};
							}

							return gunData
						})
						.tap(async (gunData) =>
						{
							let buf = await fetchEpub(gunData.href, 5 * 60 * 1000);

							// @ts-ignore
							gunData.base64 = buf;
						})
				;

				const content: Buffer = gunData.base64 as any;

				let result = await mimeFromBuffer(content);

				let filename = novel.cache.epub_basename
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

				delete gunData.base64;
				delete gunData.isGun;

				publishAndPokeIPFS(content, {
					filename: http_filename,
					//noPoke: true,
					cb(cid: string, ipfs: IUseIPFSApi, data: { filename: string })
					{
						gunData.href = toLink(cid, data.filename);

						putEpubFileInfo(siteID, novel.id, gunData)
							.tap(json => console.debug(`putEpubFileInfo:return`, json))
						;

						_addMutableFileSystem(`/novel-opds-now/${siteID}/${novel.pathMain_base}/${novel.novelID}`, {
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
									`${siteID}/${novel.pathMain_base}/${novel.novelID}/`,
									`${siteID}/${novel.pathMain_base}/`,
									`${siteID}/`,
								]);
							},
						})
							.catch(e => console.error(`_addMutableFileSystem`, http_filename, e))
						;
					},
				})
					.catch(e => console.error(`publishAndPokeIPFS`, http_filename, e))
				;

				return responseStream(res, content);
			})
			.catch(e =>
			{

				let { message } = e;
				if (e.code === 'ENOENT')
				{
					message = `id 不存在 或 伺服器離線`
				}

				let data = {
					error: message,
					params: req.params,
					timestamp: Date.now(),
				};

				console.error(`[${siteID}]`, data);

				res.status(404).json(data);
			})
	});

	return router
}
