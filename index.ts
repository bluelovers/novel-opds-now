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
import fileHandler from './server/file';
import __root from './lib/__root';
import Gun from 'gun';
import { setupGun } from './server/gun/setup';

const app = express();

console.log(`build cache`);
spawnSync('node', [
	join(__root, `./cli/cache.js`),
], {
	stdio: 'inherit',
});

app.use('/file', fileHandler());

app.use('/*', (req, res, next) => {
	console.log(req.baseUrl, req.url, req.params);
	next();
});

app.use('/*', (req, res) => res.end('Welcome to micro'));

setupGun(app);

console.log(`server setup ready`);
export default app
