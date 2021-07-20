import processExit from '../util/processExit';
import { assertCheckIPFS, checkIPFS, ipfsAddresses } from 'ipfs-util-lib';
import cloneDeep from 'lodash/cloneDeep';
import { IIPFSAddresses } from 'ipfs-types';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
import Bluebird, { TimeoutError } from 'bluebird';
import console from 'debug-color2/logger';
import packageJson from '../../package.json';
import computerInfo from 'computer-info';
import terminalLink from 'terminal-link';
import { IUseIPFSApi } from '../types';
import { findIpfsClient } from '@bluelovers/ipfs-http-client';
import { getDefaultServerList } from '@bluelovers/ipfs-http-client/util';
import configApiCors from 'ipfs-util-lib/lib/ipfs/config/cors';
import { multiaddrToURL } from 'multiaddr-to-url';
import { unlinkIPFSApi, unlinkIPFSApiAsync } from 'fix-ipfs/lib/ipfsd-ctl/unlinkIPFSApi';
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra';
import { sync as rimrafSync } from 'rimraf';
import { join } from 'path';
import { findFreeAddresses } from './use/port';
import { peerAbortController } from './peer';
import { inspect } from 'util';
import { pubsubSubscribe, pubsubUnSubscribe } from './pubsub/index';
import { repoExists } from './repoExists';
import { __root } from '../const';
import { backupIdentity, restoreIdentity } from './util/back-up-identity';
import { connectBuildInPeers } from './util/connect-build-in-peers';
import { daemonFactory } from './util/daemonFactory';
import { envDisposable } from './util/envDisposable';
import { initHello } from './use/initHello';
import { initMutableFileSystem } from './mfs/initMutableFileSystem';
import { initHelloCheck } from './use/initHelloCheck';
import { saveMutableFileSystemRoots } from './mfs/saveMutableFileSystemRoots';

inspect.defaultOptions ??= {};
inspect.defaultOptions.colors = console.enabledColor;

let _cache: ITSUnpackedPromiseLike<ReturnType<typeof _useIPFS>>;
let _waiting: ReturnType<typeof _useIPFS>;

let _timeout;

export function useIPFS(options?: {
	disposable?: boolean
})
{
	return Bluebird.resolve().then(() =>
	{

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
				.tap(async ({
					ipfs,
					ipfsd,
				}) =>
				{
					return pubsubSubscribe(ipfs)
						.tap(async () =>
						{
							initHello(ipfs);
							initHelloCheck(ipfs, ipfsd);
						})
						.catch(e =>
						{
							console.error(`[IPFS]`, `連接 pubsub 時發生錯誤`)
							console.error(e)
						})
				})
				;
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
	return Bluebird.resolve(cache).then((_cache) =>
		{
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

			let info = await ipfsAddresses(ipfs as any)
				.then(info =>
				{

					let u = multiaddrToURL(info.API);

					u.pathname = 'webui';

					return u
				})
				.catch(e => null)

			console.success(`IPFS Web UI available at`, terminalLink(`webui`, `https://dev.webui.ipfs.io/`), info
				? terminalLink(`webui`, info)
				: '')

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

		async stop(...argv)
		{
			// 連接到已經存在的 ipfs 伺服器時，不執行 stop 指令
			return ipfsAddresses(ipfs as any)
				.then(addr =>
				{
					console.warn(`[IPFS]`, `IPFS 伺服器可能仍在執行中，請自行停止伺服器`, addr);
				})
				.catch(e => null as null)
		},
	}
}

function _useIPFS(options?: {
	disposable?: boolean,
})
{
	console.info(`[IPFS]`, `嘗試啟動或連接至 IPFS ...`);

	const disposable = envDisposable(options?.disposable);

	let _temp;

	return Bluebird
		.resolve(disposable ? Promise.reject() : searchIpfs())
		//.tapCatch(e => console.error(e))
		.catch(async () =>
		{
			console.info(`[IPFS]`, `嘗試啟動 IPFS 伺服器...`, `可使用 IPFS_GO_EXEC 指定執行檔路徑`, `IPFS_PATH 指定 repo 路徑`);

			const { ipfsd } = await daemonFactory(disposable, options);

			if (disposable)
			{
				let Addresses = await findFreeAddresses(ipfsd.opts)

				ipfsd.opts.ipfsOptions.config ??= {};

				ipfsd.opts.ipfsOptions.config.Addresses = {
					...ipfsd.opts.ipfsOptions.config.Addresses,
					...Addresses,
				};

				console.dir(ipfsd.env, {
					depth: null,
				})

				console.dir(ipfsd.opts.ipfsOptions, {
					depth: null,
				})
			}

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
				let oldExists = await repoExists(ipfsd.path);

				console.debug(`[IPFS]`, `ipfsd`, `init`)
				await ipfsd.init(ipfsd.opts.ipfsOptions?.init);

				if (!disposable && await repoExists(ipfsd.path))
				{
					let bool = await pathExists(join(__root, 'test', '.identity.json'));

					if (!oldExists && bool)
					{
						// @ts-ignore
						ipfsd.isNewRepo = true;

						await restoreIdentity(ipfsd)

						await readJSON(join(ipfsd.path, 'config'))
							.then(config => {

								config["API"] = {
									"HTTPHeaders": {
										"Access-Control-Allow-Credentials": [
											"true"
										],
											"Access-Control-Allow-Headers": [
											"Authorization"
										],
											"Access-Control-Allow-Methods": [
											"HEAD",
											"PUT",
											"GET",
											"POST",
											"OPTIONS"
										],
											"Access-Control-Allow-Origin": [
											"*",
											"http://webui.ipfs.io.ipns.localhost:8080",
											"http://webui.ipfs.io.ipns.localhost:9090",
											"http://localhost:3000",
											"http://127.0.0.1:5001",
											"http://127.0.0.1:5002",
											"https://webui.ipfs.io",
											"https://dev.webui.ipfs.io"
										],
											"Access-Control-Expose-Headers": [
											"Location"
										]
									}
								};

								return writeJSON(join(ipfsd.path, 'config'), config, {
									spaces: 2,
								})
							})
						;
					}
					else if (!bool)
					{
						await backupIdentity(ipfsd);
					}
				}
			}

			if (!ipfsd.started)
			{
				console.debug(`[IPFS]`, `ipfsd`, `start`)
				await ipfsd.start()
					.catch(async (e) =>
					{
						e && console.warn(String(e));
						console.debug(`[IPFS]`, `ipfsd`, `start`, `retry`);

						/**
						 * `ipfsd-ctl` 這個智障BUG依然沒修
						 */
						await unlinkIPFSApiAsync(ipfsd.path).catch(e => null);

						return ipfsd.start()
					})
				;
			}

			const ipfs = ipfsd.api;

			const stop = async (...argv) =>
			{
				console.debug(`[IPFS]`, `ipfsd`, `stop`);

				if (!ipfsd.disposable)
				{
					await saveMutableFileSystemRoots(ipfs).catch(e => null)
				}

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
		.tapCatch(TimeoutError, e =>
		{
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

			const stop = (done?) =>
			{
				console.info(`[IPFS]`, `useIPFS:stop`)

				peerAbortController.abort();

				// @ts-ignore
				return Promise.all([
					_stop?.({
						timeout: 2000,
					}),
					pubsubUnSubscribe(ipfs as any),
				]).then(done ?? (() => null)) as void
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
					return new Bluebird<void>((resolve, reject) =>
					{
						try
						{
							_cache.stop(resolve)
						}
						catch (e)
						{
							reject(e)
						}
					})
				},
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
