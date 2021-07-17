import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import { StatResult } from 'ipfs-core-types/src/files';
import { pathExists, readJSON } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import itAll from 'it-all';
import { IIPFSControllerDaemon } from '../types';
import { isSameCID } from '@lazy-ipfs/is-same-cid';

export function initMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>, ipfsd: IIPFSControllerDaemon)
{
	return Bluebird.props({
			ipfs,
			ipfsd,
		})
		.then(async ({
			ipfs,
			ipfsd,
		}) =>
		{

			let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
				pin: false,
				preload: true,
			});

			let file_cid = ret.cid;

			if (true || ipfsd?.isNewRepo)
			{
				await readJSON(join(__root, 'test', '.mfs.roots.json'))
					.then(async (record: Record<string, string>) =>
					{

						//await itAll(ipfs.files.ls('/')).then(console.debug)
						//console.dir(record);

						return Bluebird.all(Object.entries(record)
								.map(([path, cid]) =>
								{
									return ipfs.files.cp(`/ipfs/${cid}`, `/${path}`, {
											parents: true,
										})
										//.catch(e => console.error(`[IPFS]`, `restore mfs`, String(e)))
										.catch(e => null)
								}))
							.then((ret) =>
							{
								//console.debug(`[IPFS]`, `restore mfs`, ret.length, record)
							})
							;
					})
					.catch(e => null)
				;
			}

			let file_path = `/novel-opds-now/Hello from novel-opds-now Checker.txt`;

			let file_stat: StatResult = await ipfs.files.stat(file_path, {
				hash: true,
			}).catch(e => null);

			if (!isSameCID(file_stat?.cid, file_cid))
			{
				/*
				await ipfs.files.mkdir(`/novel-opds-now/`, {
					parents: true,
				}).catch(e => null);
				 */

				await ipfs.files.rm(file_path).catch(e => null);
				await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
					// @ts-ignore
					pin: false,
					parents: true,
				});
			}

			//console.debug(`[IPFS]`, `initMutableFileSystem`, ret)

		})
		.catch(e =>
		{
			console.warn(`[IPFS]`, `initMutableFileSystem`, e)
		})
		;
}
