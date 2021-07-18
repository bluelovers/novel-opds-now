import { getIPFS } from '../use';
import { publishToIPFSAll, publishToIPFSRace } from 'fetch-ipfs/put';
import { filterList } from 'ipfs-server-list';
import { IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';
import { pokeAll, reportPokeAllSettledResult } from '../pokeAll';
import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';

export function publishAndPokeIPFS(content: ITSResolvable<Buffer>, options?: {
	ipfs?: ITSResolvable<IUseIPFSApi>,
	timeout?: number,
	filename?: string,
	hidden?: boolean,
	cb?(cid: string, ipfs: IUseIPFSApi, data: {
		filename: string,
	}, result: IIPFSFileApiAddReturnEntry): ITSResolvable<any>,
	noPoke?: boolean,
}, ...msg: any)
{
	return Bluebird.props({
			ipfs: options?.ipfs ?? getIPFS().catch(e => null as null),
			timeout: options?.timeout ?? 30 * 60 * 1000,
			filename: options?.filename,
			content,
			options,
		})
		.then(({
			ipfs,
			timeout,
			filename,
			content,
			options,
		}) =>
		{
			return publishToIPFSRace({
				path: filename,
				content,
			}, [
				ipfs,
				...filterList('API'),
			], {
				addOptions: {
					pin: false,
				},
				timeout,
			})
				.tap(async (ret) =>
				{
					let result: IIPFSFileApiAddReturnEntry;

					let cid: string;

					ret.find(settledResult =>
					{
						// @ts-ignore
						let value: IIPFSFileApiAddReturnEntry[] = settledResult.value ?? settledResult.reason?.value;

						if (value?.length)
						{
							result = value[0];
							const resultCID = result.cid.toString();

							if (resultCID.length)
							{
								cid = resultCID;

								console.debug(`[IPFS]`, `publishAndPokeIPFS`, `[${settledResult.status}]`, cid, ...msg);

								return true
							}
						}
					});

					let data = {
						filename,
					}

					await options?.cb?.(cid, ipfs, data, result);

					return !options.noPoke && pokeAll(cid, ipfs, data)
						.tap(settledResult =>
						{
							return reportPokeAllSettledResult(settledResult, cid, data.filename, ...msg)
						})
						;
				})
				;
		})

}
