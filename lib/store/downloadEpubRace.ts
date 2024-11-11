import { ITSValueOrArray } from 'ts-type';
import { IUseIPFSApi } from '../types';
import { handleCID, IFetchOptions, lazyRaceServerList } from 'fetch-ipfs/util';
import { raceFetchIPFS } from 'fetch-ipfs/race';
import Bluebird from 'bluebird';
import { getIPFS, getIPFSFromCache } from '../ipfs/use';
import { assertEpubByMime } from './fetch/util';
import { fetchEpub } from './fetch/fetchEpub';
import lazyMakeIpfsAllServerURL from '@lazy-ipfs/make-url-list';
import { ipfsGatewayAddressesLink } from 'ipfs-util-lib/lib/api/multiaddr';
import AbortControllerTimer from 'abort-controller-timer';
import { RequestInit } from 'node-fetch';
import console from 'debug-color2/logger';
import moment from 'moment';
import { promiseTapLazyBoth } from 'promise-tap-then-catch';
import { _abortController } from '../util/abort';

const SymbolSource = Symbol.for('href');

export function fetchEpubAll(ipfs_href: string, timeout: number, options?: {
	filter?(buf: Buffer): boolean;
	fetchOptions?: RequestInit,
} & IFetchOptions)
{
	return Bluebird.resolve()
		.then(async () => {
			const cid = handleCID(ipfs_href, true, options);

			let ipfs = getIPFS().timeout(3 * 1000)
				.catch(e => null as null)
			;

			let list = lazyMakeIpfsAllServerURL(cid, {
				serverList: [
					await ipfsGatewayAddressesLink(ipfs).catch(e => null),
				],
			});

			//console.dir(list)

			let controller: AbortControllerTimer;

			if (timeout)
			{
				controller = new AbortControllerTimer(timeout);
				options ??= {};
				options.fetchOptions ??= {};
				// @ts-ignore
				options.fetchOptions.signal ??= controller.signal
				options.fetchOptions.timeout ??= controller.timeout
			}

			const p = Bluebird.any(list.map(ipfs_href => fetchEpub(ipfs_href, timeout, options).then(ret =>
			{
				ret[SymbolSource] = ipfs_href;
				return ret;
			}).tap(assertEpubByMime)));

			return promiseTapLazyBoth(p, () => {
				_abortController(controller, options?.fetchOptions?.signal);
			})
		})
}

export function downloadEpubRace(ipfs_href: string,
	useIPFS?: ITSValueOrArray<string | IUseIPFSApi>,
	timeout?: number,
	options?: {
		filter?(buf: Buffer): boolean;
		fetchOptions?: RequestInit,
	} & IFetchOptions,
)
{
	timeout ??= 20 * 60 * 1000;

	let controller: AbortControllerTimer;

	if (timeout)
	{
		controller = new AbortControllerTimer(timeout);
		options ??= {};
		options.fetchOptions ??= {};
		// @ts-ignore
		options.fetchOptions.signal ??= controller.signal
		options.fetchOptions.timeout ??= controller.timeout
	}

	console.debug(`downloadEpubRace`, ipfs_href, options, timeout && moment()
		.locale('zh-tw').add(timeout/1000, 'seconds').fromNow(true))

	const p = Bluebird.resolve(useIPFS)
		.then(useIPFS =>
		{
			return useIPFS ?? getIPFSFromCache()
				.then(ipfs =>
				{
					return [
						ipfs,
						...lazyRaceServerList(),
					] as typeof useIPFS
				})
		})
		.then(useIPFS =>
		{
			return Bluebird.any<Buffer>([
				raceFetchIPFS(ipfs_href, useIPFS as any, timeout, options),
				fetchEpubAll(ipfs_href, timeout, options),
			])
		})
		.tap(assertEpubByMime)
	;

	return promiseTapLazyBoth(p, () => {
		_abortController(controller, options?.fetchOptions?.signal);
	})
}

