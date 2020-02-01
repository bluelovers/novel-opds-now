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
import favicon from 'serve-favicon';
import { setupGun } from './server/gun/setup';

import './server/init';
import opdsHandler from './server/opds';

const app = express();

app.use(favicon(join(__root, 'static', 'favicon.png')));

app.use('/file', fileHandler());
app.use('/opds', opdsHandler());

app.use('/*', (req, res, next) => {
	console.log(req.baseUrl, req.url, req.params);
	next();
});

app.use('/*', (req, res) => res.end('Welcome to micro'));

setupGun(app);

console.log(`server setup ready`);
export default app
