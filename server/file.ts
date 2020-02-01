/**
 * Created by user on 2020/2/1.
 */

import { Request, Response, Router } from 'express';
import Bluebird from 'bluebird';
import { EnumNovelSiteList } from 'novel-downloader/src/all';
import { __cacheMapFile } from '../lib/const';
import { spawnSync } from "child_process";
import { join, basename } from "path";
import { readJSON, writeJSON, readFile, remove } from 'fs-extra';
import { ICacheMap } from '../lib/types';
import { PassThrough } from "stream";
import { fromBuffer } from 'file-type';
import __root from '../lib/__root';
import useGun from './gun/setup';

function fileHandler()
{
	const router = Router();

	router.use('/:siteID/:id', (req, res) =>
	{
		console.log(req.baseUrl, req.url, req.params);

		let siteID = req.params.siteID;
		let novel_id = req.params.id;

		if (siteID.toLowerCase() === 'dmzj')
		{
			siteID = EnumNovelSiteList.NovelSiteDmzjApi
		}

		let map_file = __cacheMapFile;

		return Bluebird
			.resolve()
			.then(async () =>
			{
				let gunData = await useGun()
					// @ts-ignore
					.get('epub-file')
					.get(req.params.siteID)
					.get(req.params.id)
					.then(function (data)
					{

						if (data && data.exists)
						{
							let { base64, filename, exists, timestamp } = data;
							let isGun = false;

							if (!(base64 && filename && exists && timestamp))
							{
								console.warn(`於P2P緩存發現檔案...`, `但資料似乎已損毀`);
								return null
							}

							console.log(`於P2P緩存發現檔案...`, new Date(timestamp));

							if ((Date.now() - data.timestamp) < 86400 * 1000)
							{
								isGun = true;
							}
							else
							{
								console.log(`目標檔案已過期，試圖重新建立檔案`)
							}

							return {
								base64,
								filename,
								exists,
								timestamp,
								isGun,
							}
						}
						else
						{
							console.log(`沒有發現P2P緩存...`);
						}
					})
				;

				return gunData
			})
			.then(async (gunData) => {
				return Promise.resolve()
					.then(async () => {

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

						let map: ICacheMap = await readJSON(map_file);

						if (!map || !map[siteID] || !map[siteID][novel_id])
						{
							return Promise.reject(new Error(`建立檔案時失敗，${siteID} ${novel_id} 可能不存在或解析失敗...`))
						}

						let _data = map[siteID][novel_id];

						if (map[req.params.siteID]) delete map[req.params.siteID][req.params.id];
						if (map[_data.siteID]) delete map[_data.siteID][_data.novel_id2];
						if (map[_data.IDKEY]) delete map[_data.IDKEY][_data.novel_id2];
						if (map[_data.siteID]) delete map[_data.siteID][_data.novel_id];
						if (map[_data.IDKEY]) delete map[_data.IDKEY][_data.novel_id];
						if (map[siteID]) delete map[siteID][novel_id];

						await writeJSON(map_file, map, { spaces: 2 }).catch(e =>
						{
							console.error(`發生錯誤，無法寫入緩存檔案 ${map_file}`);
							console.error(e)
						});

						return _data
					})
					.catch(e => {

						if (gunData && gunData.exists)
						{
							console.warn(`檔案建立失敗，使用P2P緩存代替`);

							gunData.isGun = true;

							return gunData
						}

						return Promise.reject(e)
					})
				;
			})
			.then(async (data) =>
			{
				console.log(`成功取得檔案...`);

				// @ts-ignore
				let fileContents: Buffer = data.base64 && Buffer.from(data.base64, 'base64') || await readFile(data.epub);
				// @ts-ignore
				let filename: string = data.filename || data.IDKEY + '_' + basename(data.epub);

				// @ts-ignore
				if (!data.isGun)
				{
					let gunData = {
						timestamp: Date.now(),
						exists: true,
						filename,
						base64: fileContents.toString('base64'),
					};

					if (req.params.siteID !== data.IDKEY || req.params.id !== data.novel_id)
					{
						useGun()
							// @ts-ignore
							.get('epub-file')
							.get(req.params.siteID)
							.get(req.params.id)
							.put(gunData)
						;
					}

					useGun()
						// @ts-ignore
						.get('epub-file')
						.get(data.IDKEY)
						.get(data.novel_id)
						.put(gunData)
					;
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

				console.log(`將檔案傳送至客戶端...`);
				readStream.pipe(res);

				if (typeof data.removeCallback === 'function')
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

				useGun()
					// @ts-ignore
					.get('epub-file')
					.get(req.params.siteID)
					.get(req.params.id)
					.put({
						timestamp: Date.now(),
						exists: false,
					})
				;

				let data = {
					error: message,
					params: req.params,
					timestamp: Date.now(),
				};

				res.status(404).json(data);

				console.warn(data);

				console.warn(`以下錯誤訊息為除錯用，並非每個都會對程式造成影響 =>`, e)

			})
	});

	return router
}

export default fileHandler
