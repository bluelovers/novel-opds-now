import { createController, createFactory  } from 'ipfsd-ctl';
import ipfs_http_client, { EndpointConfig } from 'ipfs-http-client';
import processExit from '../processExit';
import { ipfsAddresses, checkIPFS } from 'ipfs-util-lib';
import { assertCheckIPFS } from 'ipfs-util-lib';
import cloneDeep from 'lodash/cloneDeep';
import { IIPFSAddresses } from 'ipfs-types';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
import Bluebird, { TimeoutError } from 'bluebird';
import console from 'debug-color2/logger';
import packageJson from '../../package.json';
import computerInfo from 'computer-info';
import terminalLink from 'terminal-link';
import { connectPeersAll, pubsubPublishHello, pubsubSubscribe, pubsubUnSubscribe } from './pubsub';
import { IUseIPFSApi } from '../types';
import { findIpfsClient } from '@bluelovers/ipfs-http-client';
import { getDefaultServerList } from '@bluelovers/ipfs-http-client/util';
import ipfsEnv from 'ipfs-env';
import configApiCors from 'ipfs-util-lib/lib/ipfs/config/cors';
import { multiaddrToURL } from 'multiaddr-to-url';
import { repoExists } from './repoExists';
import tmpDir, { tmpPath } from '../tmpDir';
import { unlinkIPFSApi } from 'fix-ipfs/lib/ipfsd-ctl/unlinkIPFSApi';
import re from '../re';
import fs, { remove, removeSync, ensureDir } from 'fs-extra';
import { sync as rimrafSync } from 'rimraf';
import { join } from 'path';
import { envBool } from 'env-bool';

let _cache: ITSUnpackedPromiseLike<ReturnType<typeof _useIPFS>>;
let _waiting: ReturnType<typeof _useIPFS>;

let _timeout;

declare module 'ipfs-env'
{
	interface IIPFSEnv
	{
		IPFS_DISPOSABLE?: boolean;
	}
}

export function useIPFS(options?: {
	disposable?: boolean
})
{
	return Bluebird.resolve().then(() => {

		if (_waiting?.isPending?.() ?? _waiting)
		{
			console.info(`[IPFS]`, `IPFS 仍在啟動中，請稍後...`);
		}

		return _waiting
	}).then(async () =>
	{
		//console.log('000', _waiting, _cache)

		if (typeof _waiting !== 'undefined')
		{
			_waiting = void 0;
		}

		if (_cache)
		{
			if (_cache.ipfsd?.started !== false && await checkIPFS(_cache.ipfs as any).catch(e => null))
			{
				//console.log('001', _cache)

				return _cache
			}

			await _cache.stopAsync().catch(e => null);

			_cache = void 0;

			console.warn(`[IPFS]`, `IPFS 伺服器已斷線`);
		}

		if (_timeout)
		{
			return Promise.reject(null)
		}

		_waiting = _useIPFS(options)
			.tap(v => _cache = v)
			.tap(_handle)
			.tap(async ({
				ipfsd,
				ipfs,
				path,
			}) =>
			{
				let info = await ipfsAddresses(ipfs as any).catch(e => null)

				console.info(`[IPFS]`, `IPFS 已啟動`, info, path);

				return configApiCors(ipfs as any).catch(e => null)
				/*
				.then(async (ls) => {
					console.debug(`[IPFS]`, `configApiCors:done`, ls);

					await ipfs.config.set('Experimental.AcceleratedDHTClient', true);

					return ipfs.config.get('API.HTTPHeaders').then(value => {
						console.dir(value)
					}).catch(e => null)

				})
				.catch(e => {
					console.debug(`[IPFS]`, `configApiCors:error`, e);
				})
				 */
			})
		;

		return _waiting
	})
		.catch(e =>
		{
			if (e !== null || !_timeout)
			{
				console.error(`[IPFS]`, `啟動 IPFS 時發生錯誤，可能無法正常連接至 IPFS 網路`)
				console.error(e)
			}

			return null as null
		})
}

function _handle(cache: typeof _cache)
{
	return Bluebird.resolve(cache).then((_cache) => {
			return Bluebird.props({
				ipfs: _cache.ipfs,
				id: _cache.ipfs.id(),
				version: _cache.ipfs.version(),
			})
		})
		.then(async (data) =>
		{
			const { ipfs } = data;
			const { id, agentVersion, protocolVersion } = data.id;

			_info({
				ipfs: {
					id,
					agentVersion,
					protocolVersion,
					version: data.version.version,
				},
			});

			Bluebird.delay(1000)
				.then(() => {
					return pubsubSubscribe(ipfs as any)
						.then(e => connectPeersAll(ipfs as any))
						.then(() => pubsubPublishHello(ipfs as any))
						.catch(e =>
						{
							console.error(`[IPFS]`, `連接 pubsub 時發生錯誤`)
							console.error(e)
						})
					;
				})
			;

			let info = await ipfsAddresses(ipfs as any)
				.then(info => {

					let u = multiaddrToURL(info.API);

					u.pathname = 'webui';

					return u
				})
				.catch(e => null)

			console.success(`IPFS Web UI available at`, terminalLink(`webui`, `https://dev.webui.ipfs.io/`), info ? terminalLink(`webui`, info) : '')

		})
		;
}

export async function searchIpfs()
{
	console.info(`[IPFS]`, `搜尋可用的 IPFS 伺服器...`, `可使用 IPFS_ADDRESSES_API 來指定特定伺服器`);

	let ipfsServerList = getDefaultServerList();

	let ipfs: IUseIPFSApi = await findIpfsClient(ipfsServerList as any);

	if (!await checkIPFS(ipfs).catch(e => null))
	{
		return Promise.reject(new Error)
	}

	return {
		ipfsd: undefined as null,
		ipfs,
		stop: ipfs.stop,
	}
}

export interface IIPFSControllerDaemon {

	started: boolean,
	path: string,

	api: IUseIPFSApi,

	opts: {
		disposable: boolean,
		ipfsOptions?: {
			init?: boolean,
		}
		ipfsBin?: string,
	},

	disposable: boolean,

	init(options?: any): Promise<IIPFSControllerDaemon>
	cleanup(): Promise<IIPFSControllerDaemon>
	start(): Promise<IIPFSControllerDaemon>
	stop(): Promise<IIPFSControllerDaemon>
	version(): Promise<string>
	pid(): Promise<string>
}

function _useIPFS(options?: {
	disposable?: boolean,
})
{
	console.info(`[IPFS]`, `嘗試啟動或連接至 IPFS ...`);

	let _temp;

	return Bluebird
		.resolve(searchIpfs())
		//.tapCatch(e => console.error(e))
		.catch(async () =>
		{
			console.info(`[IPFS]`, `嘗試啟動 IPFS 伺服器...`, `可使用 IPFS_GO_EXEC 指定執行檔路徑`, `IPFS_PATH 指定 repo 路徑`);

			const disposable = !!envBool(options?.disposable ?? process.env.IPFS_DISPOSABLE ?? false, true);

			if (disposable || 1 && !process.env.IPFS_PATH)
			{
				let base = join(tmpPath(), 'novel-opds-now');

				if (disposable)
				{
					process.env.IPFS_PATH = tmpDir(base).name;
				}
				else
				{
					process.env.IPFS_PATH = join(base, '.ipfs');
				}
			}

			const myFactory = createFactory({
				ipfsHttpModule: await import('ipfs-http-client'),
				ipfsBin: ipfsEnv().IPFS_GO_EXEC || await import('go-ipfs').then(m => m.path()),
				ipfsOptions: {
					EXPERIMENTAL: {
						ipnsPubsub: true,
						repoAutoMigrate: true,
					},
					//init: true,
					start: false,
				},
				...options,
				disposable: false,
			});

			const ipfsd = await myFactory.spawn() as IIPFSControllerDaemon

			await ensureDir(ipfsd.path)

			if (/[\/\\](?:\.?te?mp)[\/\\]+.+/i.test(ipfsd.path))
			{
				ipfsd.disposable = disposable;
			}

			console.debug(`[IPFS]`, `ipfsd`, _temp = {
				repo: ipfsd.path,
				ipfsBin: ipfsd.opts.ipfsBin,
				disposable: ipfsd.disposable,
			})

			if (!ipfsd.started)
			{
				console.debug(`[IPFS]`, `ipfsd`, `init`)
				await ipfsd.init(ipfsd.opts.ipfsOptions?.init);
			}

			if (!ipfsd.started)
			{
				console.debug(`[IPFS]`, `ipfsd`, `start`)
				await ipfsd.start()
					.catch(async (e) => {
						console.debug(`[IPFS]`, `ipfsd`, `start`, `retry`);

						/**
						 * `ipfsd-ctl` 這個智障BUG依然沒修
						 */
						await unlinkIPFSApi(ipfsd.path)

						return ipfsd.start()
					})
				;
			}

			const ipfs = ipfsd.api;

			const stop = (...argv) => {
				console.debug(`[IPFS]`, `ipfsd`, `stop`);

				// @ts-ignore
				let ls = [ipfsd.stop(...argv)];

				if (ipfsd.disposable && /[\/\\](?:\.?te?mp)[\/\\]+.+/i.test(ipfsd.path))
				{
					console.debug(`[IPFS]`, `ipfsd`, `cleanup`);
					ls.push(rimrafSync(ipfsd.path) as any)
					ls.push(ipfsd.cleanup())
				}

				return Promise.all(ls)
			}

			await assertCheckIPFS(ipfs).tapCatch(stop);

			return {
				ipfsd,
				ipfs,
				stop,
			}
		})
		.timeout(60 * 1000)
		.tapCatch(TimeoutError, e => {
			_timeout = true;
			console.error(`[IPFS]`, `啟動時間過長，請檢查或刪除 IPFS repo 路徑後重新執行`, _temp)
			_temp = void 0
		})
		/*
		.tapCatch(e => {
			console.error(e)
		})
		 */
		.then(async ({
			// @ts-ignore
			ipfsd,
			ipfs,
			stop: _stop,
		}) =>
		{
			// @ts-ignore
			const path: string = ipfsd?.path;

			const stop = (done) => {
				console.info(`[IPFS]`, `ipfs:stop`)
				// @ts-ignore
				return Promise.all([
					_stop({
						timeout: 2000,
					}),
					pubsubUnSubscribe(ipfs as any),
				]).then(done) as void
			}

			const ret = {
				ipfsd,
				path,
				get ipfs()
				{
					return ipfs
				},
				async address()
				{
					let addr = await ipfsAddresses(ipfs as any);
					return cloneDeep(addr) as IIPFSAddresses
				},
				stop,
				stopAsync()
				{
					return new Bluebird<void>((resolve, reject) => {
						try
						{
							_cache.stop(resolve)
						}
						catch (e)
						{
							reject(e)
						}
					})
				}
			};

			processExit(ret.stop);

			return ret
		})
}

export function _info(data?)
{
	// @ts-ignore
	if (_info.disable)
	{
		return;
	}

	let {
		osystem,
		ram,
		cpu,
		arch,
		node,
	} = computerInfo() as {
		name: 'USER-2019',
		osystem: 'Windows_NT',
		ram: '26',
		freeram: '10',
		cpu: 'Intel(R) Core(TM) i7-6700 CPU @ 3.40GHz',
		arch: 'x64',
		node: 'v14.0.0'
	};

	console.info({
		...data,
		osystem,
		ram,
		cpu,
		arch,
		node,
		[packageJson.name]: packageJson.version,
	})

	// @ts-ignore
	_info.disable = true;
}

export function getIPFS()
{
	return useIPFS().then<IUseIPFSApi>(m => m.ipfs).catch(e => null as IUseIPFSApi)
}
