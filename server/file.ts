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
					.get(siteID)
					.get(novel_id)
					.then(function (data)
					{

						if (data.exists)
						{
							let { base64, filename, exists, timestamp } = data;
							let isGun = false;

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

						let map = await readJSON(map_file) as ICacheMap;

						let _data = map[siteID][novel_id];

						if (map[_data.siteID]) delete map[_data.siteID][_data.novel_id2];
						if (map[_data.IDKEY]) delete map[_data.IDKEY][_data.novel_id2];
						if (map[_data.siteID]) delete map[_data.siteID][_data.novel_id];
						if (map[_data.IDKEY]) delete map[_data.IDKEY][_data.novel_id];
						if (map[siteID]) delete map[siteID][novel_id];

						await writeJSON(map_file, map, { spaces: 2 }).catch(e =>
						{
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

					useGun()
						// @ts-ignore
						.get('epub-file')
						.get(siteID)
						.get(novel_id)
						.put(gunData)
					;

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
					.get(siteID)
					.get(novel_id)
					.put({
						timestamp: Date.now(),
						exists: false,
					})
				;

				let data = {
					error: message,
					params: req.params,
				};

				res.status(404).json(data);

				console.error(`catch error`, e)
				console.dir(data)

			})
	});

	return router
}

export default fileHandler
