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
import { Details, express as useragent } from 'express-useragent';
import { showClient } from './util/showClient';
import { getIPFS, useIPFS } from '../lib/ipfs/use';
import { isLocalNetwork, notAllowCors } from '../lib/ip';
import { networkInterfaces } from 'os';
import { format as urlFormat } from 'url';
import terminalLink from 'terminal-link';
import searchIPAddress from 'address2';
import routerPokeHandler from './router/poke';
import { getPubsubPeers } from '../lib/ipfs/pubsub/index';
import helmet from 'helmet';
import calibreHandler from './router/calibre/index';

const app = express();

//app.use(gunServe);
//app.use('/gun', gunHttp);
app.use(helmet({
	// 禁用之後才能正常顯示 QR
	contentSecurityPolicy: false,
}));
app.use(favicon(join(__root, 'static', 'favicon.png')));
app.use(mw())
app.use(useragent())

app.use(calibreHandler);

app.use('/file', fileHandler());
app.use('/opds', opdsHandler());
app.use('/search', searchHandler());

app.use('/poke', routerPokeHandler());

app.use('/*', (req, res, next) => {
	console.log(req.method, req.baseUrl, req.url, req.params, req.query);
	showClient(req, res, next);
	next();
});

app.use('/.status', async (req, res, next) => {

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

	let isLocal = await Promise.resolve().then(() => isLocalNetwork(req.clientIp)).catch(e => null as null);

	let interfaces = isLocal && Promise.resolve().then(() => {
		let ip = searchIPAddress();
		let interfaceName = ip;
		let port = process.env.PORT;

		let interfaces = networkInterfaces();
		Object.entries(interfaces)
			.forEach(([name, data]) =>
			{

				let _skip = false;

				data = data
					.filter(v =>
					{

						if (ip && v.address === ip)
						{
							interfaceName = name;
							_skip = true;
						}
						else if (v.address === '127.0.0.1' || v.address === '::1')
						{
							_skip = true;
						}

						return v.address && !_skip
					})
				;

				if (_skip)
				{
					return;
				}

				let ls = data
					.filter(v =>
					{
						return v.family === 'IPv4'
					})
				;

				return (ls.length ? ls : data)
					.forEach(v =>
					{
						let ip = v.address;
						return urlFormat({
							protocol: 'http',
							hostname: ip,
							port,
							pathname: '/opds',
						});
					})
				;
			})
		;

		return interfaces;
	}).catch(e => null as null)

	let ipfs = await useIPFS().timeout(3000).then(_cache => {
		return Bluebird.props({
			//ipfs: _cache.ipfs,
			id: _cache.ipfs.id({
				timeout: 3000,
			}).then(v => {
				let { id, agentVersion, protocolVersion } = v;

				return {
					id, agentVersion, protocolVersion
				}
			}).catch(e => null as null),
			version: _cache.ipfs.version({
				timeout: 3000,
			}).catch(e => null as null),
			address: isLocal && Bluebird.resolve(_cache.address()).timeout(3000).catch(e => null as null),

			pubsub: getPubsubPeers(_cache.ipfs),
		})
	}).catch(e => null as null);

	return res.json({
		timestamp: Date.now(),
		live: true,
		opds: url,
		opds_qr: 'https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + url,

		ipfs: await ipfs,

		interfaces: await interfaces,

		user: {
			client: req.clientIp,
			useragent: req.useragent,
			headers: req.headers,
		},

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
