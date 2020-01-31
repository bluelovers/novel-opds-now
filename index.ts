/**
 * Created by user on 2020/1/28.
 */
import micro, { RequestHandler, buffer, text, json } from 'micro';
import express from 'express';
import { EnumNovelSiteList } from 'novel-downloader/src/all';
import { spawnSync } from 'child_process';
import { readJSON, readJSONSync, readFile, remove, writeJSON } from 'fs-extra';
import { join, basename } from "path";
import Bluebird from 'bluebird';
import { ICacheMap } from './lib/types';
import { PassThrough } from 'stream';
import { fromBuffer } from 'file-type';
import { __cacheMapFile } from './lib/const';

const app = express();

console.log(`build cache`);
spawnSync('node', [
	join(__dirname, `./cli/cache.js`),
]);

app.use('/file/:siteID/:id', (req, res) => {
	return Bluebird
		.resolve()
		.then(async () => {

			console.log(req.baseUrl, req.url, req.params);

			let siteID = req.params.siteID;
			let novel_id= req.params.id;

			if (siteID.toLowerCase() === 'dmzj')
			{
				siteID = EnumNovelSiteList.NovelSiteDmzjApi
			}

			let map_file = __cacheMapFile;

			let cp = spawnSync('node', [
				join(__dirname, `./cli/cli.js`),
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

			await writeJSON(map_file, map, {spaces:2}).catch(e => {
				console.error(e)
			});

			return _data
		})
		.then(async (data) =>
		{

			let fileContents = await readFile(data.epub);

			let readStream = new PassThrough();
			readStream.end(fileContents);

			let { mime, ext } = await fromBuffer(fileContents);

			if (ext === 'epub' && mime === 'application/zip')
			{
				mime = 'application/epub+zip';
			}

			res.set('Content-disposition', 'attachment; filename=' + data.IDKEY + '_' + basename(data.epub));
			res.set('Content-Type', mime);

			console.log(`send file to client`)
			readStream.pipe(res);

			if (typeof data.removeCallback === 'function')
			{
				data.removeCallback();
			}
			else
			{
				remove(data.outputDir)
			}
		})
		.catch(e => {

			let { message } = e;
			if (e.code === 'ENOENT')
			{
				message = `id 不存在 或 伺服器離線`
			}

			res.json({
				error: message,
				params: req.params,
			})

			console.error(`catch error`, e)

		})
});

app.use('/*', (req, res) => res.end('Welcome to micro'));

console.log(`server setup ready`);
export default app
