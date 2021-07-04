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

			if (_cache)
			{
				return _cache
			}
		}

		if (_cache)
		{
			if (await checkIPFS(_cache.ipfs as any))
			{
				return _cache
			}

			await _cache.stop().catch(e => console.error(e))
		}

		_waiting = _useIPFS(options);

		return _cache = await _waiting
			.tap(_handle)
			.tap(() => {
				console.info(`[IPFS]`, `IPFS 已啟動`);
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
				.catch(e => {
					console.error(`[IPFS]`, `連接 pubsub 時發生錯誤`)
					console.error(e)
				})
			;

			console.success(`IPFS Web UI available at`, terminalLink(`webui`, `https://dev.webui.ipfs.io/`))

		})
		.catch(e => {
			console.error(`[IPFS]`, `啟動 IPFS 時發生錯誤，可能無法正常連接至 IPFS 網路`)
			console.error(e)
		})
	;
}

function _useIPFS(options?: {
	disposable?: boolean,
})
{
	return Bluebird.resolve().then(async () =>
	{
		console.info(`[IPFS]`, `嘗試啟動或連接至 IPFS`);

		const ipfsd = await createController({
			ipfsHttpModule: await import('ipfs-http-client'),
			ipfsBin: await import('go-ipfs').then(m => m.path()),
			ipfsOptions: {
				EXPERIMENTAL: {
					ipnsPubsub: true,
					repoAutoMigrate: true,
				},
			},
			...options,
		}) as {
			api: IUseIPFSApi,
			init(options?: any): Promise<typeof ipfsd>
			cleanup(): Promise<typeof ipfsd>
			start(): Promise<typeof ipfsd>
			stop(): Promise<typeof ipfsd>
			version(): Promise<string>
			pid(): Promise<string>
		}

		const ipfs = ipfsd.api;

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
				console.info(`[IPFS]`, `ipfsd:stop`)

				await pubsubUnSubscribe(ipfs as any);

				return ipfsd.stop()
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
