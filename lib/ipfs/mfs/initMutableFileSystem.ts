import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import { MFSEntry, StatResult } from 'ipfs-core-types/src/files';
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
import { globalWaiting, newWaitingPromise } from '../../util/globalWaiting';
import itFirst from 'it-first';
import { toCID } from '@lazy-ipfs/to-cid';

export function _checkIPFSWithMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>): Bluebird<boolean>
{
	return Bluebird.resolve(ipfs)
		.then(ipfs =>
		{
			return Bluebird.all([
					ipfs.files.stat(`/novel-opds-now`, {
						hash: true,
						timeout: 5000,
					}),
					itFirst(ipfs.files.ls(`/`, {
						timeout: 5000,
					})).then(result =>
					{
						if (!result.name.length)
						{
							return Promise.reject()
						}
					}),
				])
				.tapCatch(e => {
					//Error.captureStackTrace(e)
					console.error(e)
				})
				;
		})
		.thenReturn(true)
		.catchReturn(false)
}

export function initMutableFileSystem(ipfs: ITSResolvable<IUseIPFSApi>, ipfsd: IIPFSControllerDaemon)
{
	// @ts-ignore
	if (initMutableFileSystem.inited)
	{
		return Bluebird.resolve(void 0)
	}

	// @ts-ignore
	initMutableFileSystem.inited = true;

	return newWaitingPromise('initMutableFileSystem', () =>
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
				const hello_txt_name = `Hello from novel-opds-now Checker.txt` as const

				if (true || ipfsd?.isNewRepo)
				{
					await readJSON(join(__root, 'test', '.mfs.roots.json'))
						.then(async (record: Record<string, string>) =>
						{
							let pa = [[], []] as Promise<any>[][];

							await Bluebird.resolve(Object.entries(record))
								.mapSeries(async ([path, cid]) =>
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

									// @ts-ignore
									cid = toCID(cid);

									if (isSameCID(cid, stat?.cid as any))
									{
										//console.gray.debug(`[IPFS]`, `skip restore mfs`, `${cid}`, target_path)

										return;
									}
									else if (isSameCID('QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn', stat?.cid as any))
									{
										await ipfs.files.rm(target_path).catch(e => null)
									}
									else if (stat?.cid && path === `novel-opds-now`)
									{
										console.warn(`[IPFS]`, `'${target_path}'`, `already exists`, stat.cid)

										await itAll<MFSEntry>(ipfs.files.ls(target_path))
											.then(async (ls) =>
											{

												if (ls?.length === 1)
												{
													for (const entry of ls)
													{
														if (entry.type === 'file' && entry.name === hello_txt_name)
														{
															await ipfs.files.rm(`${target_path}/${entry.name}`).catch(e => null)
															break;
														}
													}
												}

												if (ls?.length === 0)
												{
													await ipfs.files.rm(target_path).catch(e => null)

													return false;
												}

												return true;
											})
											.catch(e => true)
										;
									}
									else if (stat?.cid)
									{
										console.warn(`[IPFS]`, `'${target_path}'`, `already exists`, stat.cid)
									}

									console.debug(`[IPFS]`, `restore mfs`, `${cid}`, target_path)

									const p = _ipfsFilesCopyCID(ipfs, cid, target_path, {
											//parents: true,
										})
											.catch(e => console.error(`[IPFS]`, `restore mfs`, String(e)))
									;

									if (path.includes('novel-opds-now'))
									{
										pa[0] ??= [];
										pa[0].push(p)
									}
									else
									{
										pa[1] ??= [];
										pa[1].push(p)
									}
								})
							;

							//await itAll(ipfs.files.ls('/')).then(console.debug)
							//console.dir(record);

							//console.dir(pa)

							return Promise.all(pa[0])
						})
						.catch(e => console.warn(e))
					;
				}

				//console.debug(`[IPFS]`, `mfs`, `create`, `/novel-opds-now/${hello_txt_name}`)

				let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
					pin: false,
					preload: true,
				});

				let file_cid = ret.cid;

				let file_path = `/novel-opds-now/${hello_txt_name}`;

				let file_stat: StatResult = await ipfs.files.stat(file_path, {
					hash: true,
				}).catch(e => null);

				if (!isSameCID(file_stat?.cid as any, file_cid as any))
				{
					/*
					await ipfs.files.mkdir(`/novel-opds-now/`, {
						parents: true,
					}).catch(e => null);
					 */

					await ipfs.files.rm(file_path).catch(e => null);
					await _ipfsFilesCopyCID(ipfs, file_cid as any, file_path, {
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
