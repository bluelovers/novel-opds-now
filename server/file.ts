/**
 * Created by user on 2020/2/1.
 */

import { Router } from 'express';
import Bluebird, { TimeoutError } from 'bluebird';
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { __cacheMapFile } from '../lib/const';
import { join, basename } from "path";
import { readJSON, writeJSON, readFile, remove } from 'fs-extra';
import { ICacheMap, IGunEpubNode, IGunEpubData, ICacheMapRow, EnumCacheMapRowStatus } from '../lib/types';
import { PassThrough } from "stream";
import { fromBuffer } from 'file-type';
import __root from '../lib/__root';
import { siteID2IDKEY } from 'novel-downloader/src/all/util';
import console from 'debug-color2/logger';
import { async as crossSpawn } from 'cross-spawn-extra';
import { getGunEpubFile2 } from '../lib/store';
import contentDisposition from '@lazy-http/content-disposition';
import { showClient } from './util/showClient';
import { getIPFSEpubFile, putIPFSEpubFile } from '../lib/store/ipfs';
import { mimeFromBuffer } from '../lib/util/mimeFromBuffer';
import { doPackEpubFromSource } from '../lib/doPackEpubFromSource';
import { getNovelData } from '../lib/site/cached-data/getNovelData';
import { siteNeverExpired } from '../lib/site/siteNeverExpired';
import { demoNovelFileHandler } from './router/file/demonovel';
import { deleteEpubProcessCacheJson, getEpubProcessCacheJson } from '../lib/epub/epubProcessCacheJson';
import { getIPFS, getIPFSFromCache } from '../lib/ipfs/use';

export type IRouter = Router;

function fileHandler()
{
	const router: IRouter = Router();

	router.use('/demo(novel)?', demoNovelFileHandler());

	router.use('/:siteID/:novelID', (req, res) =>
	{
		let query = {
			...req.params,
			...req.query as {
				filename?: string,
				id?: string,
				debug?: boolean,
				force?: boolean,
			},
		};

		delete query.siteID;
		delete query.id;

		console.debug(req.method, req.baseUrl, req.url, req.params, query);
		showClient(req, res);

		let siteID = String(req.params.siteID || '')
			.trim()
			.replace(/\.xml$|[\/\\]+/ig, '')
		;
		let novel_id = String(req.params.novelID || '')
			.trim()
		;

		if (siteID.toLowerCase() === 'dmzj')
		{
			siteID = EnumNovelSiteList.NovelSiteDmzjApi
		}

		let IDKEY = siteID2IDKEY(siteID);

		if (siteID === 'masiro')
		{
			IDKEY = 'masiro' as any
		}

		return Bluebird
			.resolve(IDKEY)
			.tap(IDKEY =>
			{
				if (!IDKEY)
				{
					return Promise.reject(new Error(`${siteID} 模組不存在`))
				}

				if (!novel_id)
				{
					return Promise.reject(new Error(`沒有指定需要下載的 id: '${novel_id}'`));
				}
			})
			.then(async () =>
			{
				console.info(`檢查是否存在緩存...`, siteID, novel_id);

				/**
				 * @todo 修改為直接先判斷是否過期，如果過期則同時下載緩存以及從原始網站打包
				 */
				return getIPFSEpubFile(IDKEY, [
					req.params.novelID,
					novel_id,
				], {
					query,
				})
					.tap(gunData =>
					{

						if (gunData?.exists)
						{
							let msg = '';
							if (!siteNeverExpired(siteID) && (query.debug || query.force))
							{
								let mod = ` FORCE 模式`
								if (query.debug)
								{
									mod = ` DEBUG 模式`
								}
								msg = `，但${mod}已啟動，將試圖先從原始網站抓取更新`
							}
							else if (!gunData.isGun)
							{
								msg = `，但已超過緩存時間，將試圖先從原始網站抓取更新`
							}

							console.yellow.info(`於緩存發現檔案${msg}...`, new Date(gunData.timestamp), siteID, novel_id);
						}
						else
						{
							console.yellow.info(`沒有發現緩存，或緩存已損毀...`, siteID, novel_id);
						}

					})
					;
			})
			.then(async (gunData) =>
			{
				return Promise.resolve()
					.then(async () =>
					{

						if (gunData?.isGun || siteNeverExpired(siteID))
						{
							return gunData
						}

						let cp = await doPackEpubFromSource(siteID, novel_id);

						// @ts-ignore
						if (cp.error)
						{
							// @ts-ignore
							return Promise.reject(cp.error)
						}

						let _data = await getEpubProcessCacheJson(IDKEY, novel_id);

						if (!gunData && !_data)
						{
							gunData = await getGunEpubFile2([
								//req.params.siteID,
								//siteID,
								IDKEY,
							], [
								req.params.novelID,
								novel_id,
							], {
								query,
							});

							if (gunData)
							{
								return gunData
							}
						}

						if (!_data)
						{
							return Promise.reject(new Error(`建立檔案時失敗，${siteID} ${novel_id} 可能不存在或解析失敗...`))
						}
						else if (_data.status === EnumCacheMapRowStatus.WAITING_RETRY)
						{
							let e = new Error(`抓取 ${siteID} ${novel_id} 來源時失敗，伺服器可能忙碌或拒絕回應，請之後再重試...`);

							// @ts-ignore
							e.StatusCode = 504;

							return Promise.reject(e)
						}

						deleteEpubProcessCacheJson(IDKEY, novel_id, _data);

						return _data
					})
					.catch(e =>
					{

						if (gunData && gunData.exists)
						{
							console.warn(`檔案建立失敗，使用P2P緩存代替`, siteID, novel_id);

							gunData.isGun = true;

							return gunData
						}

						return Promise.reject(e)
					}) as Promise<IGunEpubData & ICacheMapRow>
					;
			})
			.then(async (data) =>
			{
				const novelData = await getNovelData(siteID, novel_id);

				console.success(`成功取得檔案...`, siteID, novel_id, novelData?.title);

				let fileContents: Buffer;
				let isFromBuffer: boolean;

				if (data.base64)
				{
					let buf = Buffer.from(data.base64);

					if (buf.length)
					{
						fileContents = buf;
						isFromBuffer = true;
					}
				}

				if (!fileContents)
				{
					fileContents = await readFile(data.epub);
				}

				removeTempOutputDir(query, data);

				// @ts-ignore
				let filename: string = data.filename || IDKEY + '_' + basename(data.epub);

				// @ts-ignore
				if (!data.isGun || true)
				{
					console.debug(`將檔案儲存到P2P緩存`, siteID, novel_id, novelData?.title);

					let gunData: IGunEpubNode = {
						timestamp: isFromBuffer && data.timestamp ? data.timestamp : Date.now(),
						exists: true,
						filename,
						base64: isFromBuffer ? data.base64 : fileContents,
					};

					putIPFSEpubFile([
						//siteID,
						//req.params.siteID,
						//data.IDKEY,
						IDKEY,
					], [
						novel_id,
						req.params.novelID,
						data.novel_id,
						// @ts-ignore
						data.novel_id2,
						novel_id,
					], gunData, {});

				}

				if (res.connection?.destroyed)
				{
					console.info(`客戶端 ( ${req.clientIp} )  已斷線，停止傳送檔案`, siteID, novel_id, novelData?.title);
					res.end();
				}
				else
				{
					let readStream = new PassThrough();
					readStream.end(fileContents);

					let { mime, ext } = await mimeFromBuffer(fileContents);

					let http_filename = filename;

					if (query.filename)
					{
						http_filename = String(query.filename)
					}

					let attachment = contentDisposition(http_filename);

					/*
					console.debug({
						query,
						http_filename,
						attachment,
						http_filename2: encodeURIComponent(http_filename),
					})
					 */

					try
					{
						res.set('Content-disposition', attachment);
					}
					catch (e)
					{

					}

					res.set('Content-Type', mime);

					let cid: string;
					if (data?.href)
					{
						cid = new URL(data.href).pathname
					}
					else
					{
						cid = await getIPFSFromCache().then(ipfs => ipfs.files.stat(`/novel-opds-now/${IDKEY}/${novel_id}/${filename}`)).then(r => '/ipfs/' + r.cid.toString()).catch(e => null)
					}

					if (cid?.length)
					{
						res.set('X-Ipfs-Path', cid);
					}

					console.info(`將檔案傳送至客戶端 ( ${req.clientIp} )...`, filename, (filename !== http_filename)
						? `=> ${http_filename}`
						: '', novelData?.title);
					readStream.pipe(res);
				}

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

				res.status(404).json(data);

				console.warn(data, siteID, novel_id);

				console.debug(`以下錯誤訊息為除錯用，並非每個都會對程式造成影響 =>`, e, siteID, novel_id)

			})
	});

	return router
}

export function removeTempOutputDir(query: {
	debug?: boolean
}, data: {
	outputDir: string
	removeCallback?(): any
})
{
	return Bluebird.resolve().delay(30 * 1000)
		.then(() =>
		{
			if (query.debug)
			{
				console.debug(`忽略刪除下載暫存 ${data.outputDir}`);
			}
			else if (typeof data.removeCallback === 'function')
			{
				return data.removeCallback();
			}
			else if (data.outputDir)
			{
				return remove(data.outputDir)
			}
		})
		.catch(e =>
		{
			console.warn(`removeTempOutputDir`, e)
		})
		;
}

export default fileHandler