import { IUseIPFSApi } from '../../types';
import { isMatch } from 'micromatch';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';

/**
 * @deprecated because this will freeze ipfs files api
 * @see https://github.com/ipfs/go-ipfs/issues/8301
 */
export function deepList(ipfs: IUseIPFSApi, rootStart: string, options?: {
	debug?: boolean,
	glob?: string | string[],
	ignore?: string | string[],
}, isChild?: true)
{
	return Bluebird.resolve()
		.then(async () =>
		{
			options ??= {};
			let map = new Map<string, string>()

			if (typeof isChild === 'undefined')
			{
				rootStart = rootStart.replace(/\/$/, '')

				if (rootStart[0] !== '/')
				{
					rootStart = '/' + rootStart;
				}

				let stat = await ipfs.files.stat(rootStart + '/', {
					timeout: 2000,
					hash: true,
				});

				map.set(rootStart + '/', stat.cid.toString())

				options.debug && debug(map, rootStart + '/');

				options.glob = [options.glob].flat().filter(v => v?.length);

				if (!options.glob?.length)
				{
					delete options.glob
				}

				options.ignore = [options.ignore].flat().filter(v => v?.length);

				if (!options.ignore?.length)
				{
					delete options.ignore
				}
			}

			for await (const entry of ipfs.files.ls(rootStart, {
				timeout: 2000,
			}))
			{
				let path = `${rootStart}/${entry.name}`
				let path2 = path;

				if (entry.type === 'directory')
				{
					path2 += '/';

					let ls2 = await deepList(ipfs, path, options, true).catch(e => (null as null));

					if (ls2?.size)
					{
						map.set(path2, entry.cid.toString());
						options.debug && debug(map, path2);

						ls2
							.forEach((path, cid) =>
							{
								map.set(path, cid)
							})
						;
					}
					else
					{
						console.red.debug(`deepList`, path, entry.cid.toString(), ls2?.size)
					}
				}
				else if (!options.glob?.length || isMatch(entry.name, options.glob, {
					ignore: options.ignore,
				}))
				{
					map.set(path2, entry.cid.toString());
					options.debug && debug(map, path2);
				}
			}

			return map
		})
}

function debug(map: Map<string, string>, path: string)
{
	console.debug(`deepList`, path, map.get(path))
}
