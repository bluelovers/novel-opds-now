/**
 * Created by user on 2020/2/1.
 */

import { Router } from 'express';
import Bluebird from 'bluebird';
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { __cacheMapFile } from '../lib/const';
import { spawnSync } from "child_process";
import { join, basename } from "path";
import { readJSON, writeJSON, readFile, remove } from 'fs-extra';
import { ICacheMap, IGunEpubNode, IGunEpubData, ICacheMapRow, EnumCacheMapRowStatus } from '../lib/types';
import { PassThrough } from "stream";
import { fromBuffer } from 'file-type';
import __root from '../lib/__root';
import { raceGunEpubFile, makeArrayEntrys, nodeGunEpubFile } from '../lib/gun/epubFile';
import { siteID2IDKEY } from 'novel-downloader/src/all/util';
import console from 'debug-color2/logger';
import checkGunData from '../lib/gun/checkData';

function fileHandler()
{
	const router = Router();

	router.use('/:siteID/:novelID', (req, res) =>
	{
		let query = {
			...req.params,
			...req.query,
		};

		delete query.siteID;
		delete query.id;

		console.debug(req.baseUrl, req.url, req.params, query);

		let siteID = req.params.siteID;
		let novel_id = req.params.novelID;

		if (siteID.toLowerCase() === 'dmzj')
		{
			siteID = EnumNovelSiteList.NovelSiteDmzjApi
		}

		let IDKEY = siteID2IDKEY(siteID);

		let map_file = __cacheMapFile;

		return Bluebird
			.resolve(IDKEY)
			.tap(IDKEY => {
				if (!IDKEY)
				{
					return Promise.reject(new Error(`${siteID} 模組不存在`))
				}
			})
			.then(async () =>
			{
				let gunData = await raceGunEpubFile([
						//req.params.siteID,
						//siteID,
					IDKEY,
					], [
						req.params.novelID,
						novel_id,
					])
					.then(function (data)
					{
						let bool: boolean = checkGunData(data);

						if (checkGunData(data))
						{
							let { base64, filename, exists, timestamp } = data;
							let isGun = false;

							console.info(`於P2P緩存發現檔案...`, new Date(timestamp));

							if (query.debug || query.force)
							{
								console.info(`發現強制下載指令，本次將無視緩存`, query)
							}
							else if ((Date.now() - data.timestamp) < 86400 * 1000)
							{
								isGun = true;
							}
							else
							{
								console.warn(`目標檔案已過期，試圖重新建立檔案`)
							}

							return {
								base64,
								filename,
								exists,
								timestamp,
								isGun,
							} as IGunEpubData
						}
						else if (bool === false)
						{
							console.warn(`於P2P緩存發現檔案...`, `但資料似乎已損毀`);
						}
						else
						{
								console.info(`沒有發現P2P緩存...`);
						}

						return null
					})
				;

				return gunData
			})
			.then(async (gunData) =>
			{
				return Promise.resolve()
					.then(async () =>
					{

						if (gunData && gunData.isGun)
						{
							return gunData
						}

						console.log(`取得檔案中...`);
						let cp = spawnSync('node', [
							'--experimental-worker',
							join(__root, `./cli/cli.js`),
							'--mod',
							'all',
							'--siteID',
							siteID,
							'--novel_id',
							novel_id,
						], {
							stdio: 'inherit',
						});

						if (cp.error)
						{
							return Promise.reject(cp.error)
						}

						let map: ICacheMap = await readJSON(map_file).catch(e => null);

						if (!map || !map[IDKEY] || !map[IDKEY][novel_id])
						{
							console.dir(map);

							return Promise.reject(new Error(`建立檔案時失敗，${siteID} ${novel_id} 可能不存在或解析失敗...`))
						}
						else if (map[IDKEY][novel_id].status === EnumCacheMapRowStatus.WAITING_RETRY)
						{
							let e = new Error(`抓取 ${siteID} ${novel_id} 來源時失敗，伺服器可能忙碌或拒絕回應，請之後再重試...`);

							// @ts-ignore
							e.StatusCode = 504;

							return Promise.reject(e)
						}

						let _data = map[IDKEY][novel_id];

						delete map[IDKEY][_data.novel_id2];
						delete map[IDKEY][_data.novel_id];

						await writeJSON(map_file, map, { spaces: 2 }).catch(e =>
						{
							console.error(`發生錯誤，無法寫入緩存檔案 ${map_file}`);
							console.error(e)
						});

						return _data
					})
					.catch(e =>
					{

						if (gunData && gunData.exists)
						{
							console.warn(`檔案建立失敗，使用P2P緩存代替`);

							gunData.isGun = true;

							return gunData
						}

						return Promise.reject(e)
					}) as Promise<IGunEpubData & ICacheMapRow>
					;
			})
			.then(async (data) =>
			{
				console.success(`成功取得檔案...`);

				// @ts-ignore
				let fileContents: Buffer = data.base64 && Buffer.from(data.base64, 'base64') || await readFile(data.epub);
				// @ts-ignore
				let filename: string = data.filename || IDKEY + '_' + basename(data.epub);

				// @ts-ignore
				if (!data.isGun || true)
				{
					console.debug(`將檔案儲存到P2P緩存`);

					let gunData: IGunEpubNode = {
						timestamp: data.isGun ? data.timestamp : Date.now(),
						exists: true,
						filename,
						base64: fileContents.toString('base64'),
					};

					makeArrayEntrys([
						//siteID,
						//req.params.siteID,
						//data.IDKEY,
						IDKEY,
					], [
						novel_id,
						req.params.novelID,
						data.novel_id,
						data.novel_id2,
						novel_id,
					]).forEach(([siteID, novel_id]) => nodeGunEpubFile(siteID, novel_id).put(gunData));
				}

				let readStream = new PassThrough();
				readStream.end(fileContents);

				let { mime, ext } = await fromBuffer(fileContents);

				if (ext === 'epub' && mime === 'application/zip')
				{
					mime = 'application/epub+zip';
				}

				res.set('Content-disposition', 'attachment; filename=' + filename);
				res.set('Content-Type', mime);

				console.info(`將檔案傳送至客戶端...`);
				readStream.pipe(res);

				if (query.debug)
				{
					//console.log(`忽略刪除下載暫存 ${data.outputDir}`);
				}
				else if (typeof data.removeCallback === 'function')
				{
					data.removeCallback();
				}
				else if (data.outputDir)
				{
					remove(data.outputDir)
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

				console.warn(data);

				console.debug(`以下錯誤訊息為除錯用，並非每個都會對程式造成影響 =>`, e)

			})
	});

	return router
}

export default fileHandler
