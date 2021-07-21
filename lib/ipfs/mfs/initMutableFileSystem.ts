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
import pokeAll from '../pokeAll';
import { pokeRoot } from './pokeRoot';
import { ipfsFilesCopy } from '@lazy-ipfs/compatible-files';
import { _ipfsFilesCopyCID } from './_ipfsFilesCopy';
import { dirname } from 'path/posix';
import { globalWaiting, newWaitingPromise } from '../../util/globalWaiting';

export function initMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>, ipfsd: IIPFSControllerDaemon)
{
	return newWaitingPromise('initMutableFileSystem', () => {
		return Bluebird.props({
				ipfs,
				ipfsd,
			})
			.then(async ({
				ipfs,
				ipfsd,
			}) =>
			{

				if (true || ipfsd?.isNewRepo)
				{
					await ipfs.files.rm(`/novel-opds-now/Hello from novel-opds-now Checker.txt`).catch(e => null);

					await readJSON(join(__root, 'test', '.mfs.roots.json'))
						.then(async (record: Record<string, string>) =>
						{
							let pa = [[]] as Promise<any>[][];

							Object.entries(record)
								.map(async ([path, cid]) =>
								{
									if (!path?.length || !cid?.length || path === '/')
									{
										return;
									}

									const target_path = `/${path}`;

									let stat = await ipfs.files.stat(target_path, {
										hash: true,
									}).catch(e => null as null);

									//console.yellow.debug(`[IPFS]`, isSameCID(cid, stat?.cid), cid, stat?.cid)

									if (isSameCID(cid, stat?.cid))
									{
										//console.gray.debug(`[IPFS]`, `skip restore mfs`, `${cid}`, target_path)

										return;
									}
									else if (isSameCID('QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn', stat?.cid))
									{
										await ipfs.files.rm(target_path).catch(e => null)
									}
									else if (stat?.cid)
									{
										console.warn(`[IPFS]`, `'${target_path}'`, `already exists`, stat.cid)
									}

									console.debug(`[IPFS]`, `restore mfs`, `${cid}`, target_path)

									const p = _ipfsFilesCopyCID(ipfs, cid, target_path, {
											parents: true,
										})
											.catch(e => console.error(`[IPFS]`, `restore mfs`, String(e)))
											.catch(e => null)
									;

									if (path.includes('novel-opds-now'))
									{
										pa[0].push(p)
									}
									else
									{
										pa[1].push(p)
									}
								})
							;

							//await itAll(ipfs.files.ls('/')).then(console.debug)
							//console.dir(record);

							return Promise.all(pa[0])
						})
						.catch(e => null)
					;
				}

				console.debug(`[IPFS]`, `mfs`, `create`, `/novel-opds-now/Hello from novel-opds-now Checker.txt`)

				let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
					pin: false,
					preload: true,
				});

				let file_cid = ret.cid;

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
					await _ipfsFilesCopyCID(ipfs, file_cid, file_path, {
						// @ts-ignore
						pin: false,
						parents: true,
					});
				}

				pokeRoot(ipfs);

				//console.debug(`[IPFS]`, `initMutableFileSystem`, ret)

			})
			.tap(() => console.success(`[IPFS]`, `initMutableFileSystem`))
			.catch(e =>
			{
				console.warn(`[IPFS]`, `initMutableFileSystem`, e)
			})
			;
	})
}
