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
import { IGunEpubData, IGunEpubNode, IUseIPFSApi } from '../../../lib/types';
import { sanitizeFilename } from '@lazy-node/sanitize-filename';
import { _addMutableFileSystem, waitingCache } from '../../../lib/ipfs/mfs/_addMutableFileSystem';
import { saveMutableFileSystemRoots } from '../../../lib/ipfs/mfs/saveMutableFileSystemRoots';
import { pokeMutableFileSystemCore } from '../../../lib/ipfs/mfs/pokeMutableFileSystem';
import { responseStream } from 'http-response-stream';
import { putEpubFileInfo } from '../../../lib/ipfs/index';
import { toLink } from 'to-ipfs-url';
import { getPubsubPeers, pubsubPublishEpub } from '../../../lib/ipfs/pubsub/index';
import CID from 'cids';
import { getIPFSEpubFileBoth } from '../../../lib/store/fetch/getIPFSEpubFileBoth';

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

				const gunData: IGunEpubData = await getIPFSEpubFileBoth(siteID, novel.id, {
					query: req.query,
					filename: novel.cache.epub_basename,
					timestamp: novel.cache.epub_date,
					href: url.href,
				});

				const content: Buffer = Buffer.from(gunData.base64);

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
					cb(cid: string, ipfs: IUseIPFSApi, data: { filename: string }, result)
					{
						gunData.href = toLink(cid, data.filename);

						putEpubFileInfo(siteID, novel.id, gunData)
							.tap(json => console.debug(`putEpubFileInfo:return`, json))
						;

						ipfs && pubsubPublishEpub(ipfs, {
							siteID,
							novelID: novel.id,
							data: {
								path: result.path,
								cid,
								size: result.size,
							},
						}, getPubsubPeers(ipfs));

						ipfs && _addMutableFileSystem(`/novel-opds-now/${siteID}/${novel.pathMain_base}/${novel.novelID}`, {
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
				let message = e.message ?? e;
				if (e.code === 'ENOENT')
				{
					message = `id 不存在 或 伺服器離線`
				}

				let data = {
					error: message,
					params: req.params,
					timestamp: Date.now(),
				};

				console.error(`[${siteID}]`, data, (e as Error).stack);

				res.status(404).json(data);
			})
	});

	return router
}
