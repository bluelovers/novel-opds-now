import { createController } from 'ipfsd-ctl';
import ipfs_http_client, { EndpointConfig } from 'ipfs-http-client';
import processExit from '../processExit';
import { ipfsAddresses, checkIPFS } from 'ipfs-util-lib';
import cloneDeep from 'lodash/cloneDeep';
import { IIPFSAddresses } from 'ipfs-types';
import { ITSUnpackedPromiseLike } from 'ts-type';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import packageJson from '../../package.json';
import computerInfo from 'computer-info';
import terminalLink from 'terminal-link';
import { connectPeersAll, pubsubPublishHello, pubsubSubscribe, pubsubUnSubscribe } from './pubsub';
import { IUseIPFSApi } from '../types';
import { findIpfsClient } from '@bluelovers/ipfs-http-client';
import { getDefaultServerList } from '@bluelovers/ipfs-http-client/util';
import ipfsEnv from 'ipfs-env';

let _cache: ITSUnpackedPromiseLike<ReturnType<typeof _useIPFS>>;
let _waiting: ReturnType<typeof _useIPFS>;

export function useIPFS(options?: {
	disposable?: boolean
})
{
	return Bluebird.resolve(_waiting).then(async () =>
	{
		if (typeof _waiting !== 'undefined')
		{
			_waiting = void 0;
		}

		if (_cache)
		{
			if (_cache.ipfsd?.started !== false && await checkIPFS(_cache.ipfs as any).catch(e => null))
			{
				return _cache
			}

			await _cache.stop().catch(e => console.error(e))

			_cache = void 0;

			console.warn(`[IPFS]`, `IPFS 伺服器已斷線`);
		}

		_waiting = _useIPFS(options);

		return _cache = await _waiting
			.tap(_handle)
			.tap(async ({
				ipfs
			}) =>
			{
				let info = await ipfsAddresses(ipfs as any).catch(e => null)

				console.info(`[IPFS]`, `IPFS 已啟動`, info);
			})
	})
}

function _handle({
	ipfs,
}: typeof _cache)
{
	return Bluebird.props({
			id: ipfs.id(),
			version: ipfs.version(),
		})
		.then(data =>
		{
			const { id, agentVersion, protocolVersion } = data.id;

			_info({
				ipfs: {
					id,
					agentVersion,
					protocolVersion,
					version: data.version.version,
				},
			});

			pubsubSubscribe(ipfs as any)
				.then(e => connectPeersAll(ipfs as any))
				.then(() => pubsubPublishHello(ipfs as any))
				.catch(e =>
				{
					console.error(`[IPFS]`, `連接 pubsub 時發生錯誤`)
					console.error(e)
				})
			;

			console.success(`IPFS Web UI available at`, terminalLink(`webui`, `https://dev.webui.ipfs.io/`))

		})
		.catch(e =>
		{
			console.error(`[IPFS]`, `啟動 IPFS 時發生錯誤，可能無法正常連接至 IPFS 網路`)
			console.dir(e)
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
		ipfs,
		stop: ipfs.stop,
	}
}

function _useIPFS(options?: {
	disposable?: boolean,
})
{
	console.info(`[IPFS]`, `嘗試啟動或連接至 IPFS ...`);

	return Bluebird
		.resolve(searchIpfs())
		//.tapCatch(e => console.error(e))
		.catch(async () =>
		{
			console.info(`[IPFS]`, `嘗試啟動 IPFS 伺服器...`, `可使用 IPFS_GO_EXEC 指定執行檔路徑`);

			const ipfsd = await createController({
				ipfsHttpModule: await import('ipfs-http-client'),
				ipfsBin: ipfsEnv().IPFS_GO_EXEC || await import('go-ipfs').then(m => m.path()),
				ipfsOptions: {
					EXPERIMENTAL: {
						ipnsPubsub: true,
						repoAutoMigrate: true,
					},
				},
				...options,
			}) as {

				started: boolean,

				api: IUseIPFSApi,
				init(options?: any): Promise<typeof ipfsd>
				cleanup(): Promise<typeof ipfsd>
				start(): Promise<typeof ipfsd>
				stop(): Promise<typeof ipfsd>
				version(): Promise<string>
				pid(): Promise<string>
			}

			const ipfs = ipfsd.api;

			ipfsd.stop = ipfsd.stop.bind(ipfsd);

			return {
				ipfsd,
				ipfs,
				stop: ipfsd.stop,
			}
		})
		.then(({
			// @ts-ignore
			ipfsd,
			ipfs,
			stop,
		}) =>
		{

			const ret = {
				ipfsd,
				get ipfs()
				{
					return ipfs
				},
				async address()
				{
					let addr = await ipfsAddresses(ipfs as any);
					return cloneDeep(addr) as IIPFSAddresses
				},
				async stop()
				{
					console.info(`[IPFS]`, `ipfs:stop`)
					await pubsubUnSubscribe(ipfs as any);
					return stop({
						timeout: 2000,
					}) as any as void
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
