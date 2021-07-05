/**
 * Created by user on 2020/1/28.
 */
import micro, { RequestHandler, buffer, text, json } from 'micro';
import express from 'express';
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { spawnSync } from 'child_process';
import { readJSON, readJSONSync, readFile, remove, writeJSON } from 'fs-extra';
import { join, basename } from "path";
import Bluebird from 'bluebird';
import { ICacheMap } from '../lib/types';
import { PassThrough } from 'stream';
import { fromBuffer } from 'file-type';
import { __cacheMapFile } from '../lib/const';
import fileHandler from './file';
import __root from '../lib/__root';
import favicon from 'serve-favicon';
//import { setupGun } from './gun/setup';
import console from 'debug-color2/logger';

import './init';
import opdsHandler from './opds';
//import gunServe from 'gun/lib/serve';
//import gunHttp from 'gun/lib/http';
import searchHandler from "./search";
import { mw } from 'request-ip';
import { Request } from 'express-serve-static-core';
import useragent, { Details } from 'express-useragent';
import { showClient } from './util/showClient';

const app = express();

//app.use(gunServe);
//app.use('/gun', gunHttp);
app.use(favicon(join(__root, 'static', 'favicon.png')));
app.use(mw())
app.use(useragent.express())

app.use('/file', fileHandler());
app.use('/opds', opdsHandler());
app.use('/search', searchHandler());

app.use('/*', (req, res, next) => {
	console.log(req.method, req.baseUrl, req.url, req.params, req.query);
	showClient(req, res, next);
	next();
});

app.use('/.status', (req, res, next) => {

	console.log(req.headers)

	let url: string;

	try
	{
		url = new URL('/opds', req.headers.host).href;
	}
	catch (e) {};

	if (!url)
	{
		url = (req.headers.host || '') + '/opds'
	}

	return res.json({
		timestamp: Date.now(),
		live: true,
		opds: url,
		opds_qr: 'https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + url,
	})

});

app.use('/*', (req, res) => {

	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	res.charset = 'utf-8';

	//let html = `<meta charset="utf-8"/><script src="/gun.js"><script src="/gun/lib/webrtc.js"></script><script>var gun = Gun(["https://gunjs.herokuapp.com/gun","http://nmr.io:8765/gun",window.location.origin + '/gun']);</script>`;
	let html = '';

	res.end(`${html}Welcome to micro<p>請將 <a href="/opds"><script>document.write(window.location.origin + '/opds')</script></a> 加入閱讀器的訂閱內</p><p><script>document.write('<img src="https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + window.location.origin + '/opds"/>')</script></p>`)
});

console.debug(`server setup ready`);
export default app
