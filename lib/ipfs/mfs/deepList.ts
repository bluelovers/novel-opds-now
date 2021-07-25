import { IUseIPFSApi } from '../../types';

export async function deepList(ipfs: IUseIPFSApi, rootStart: string, options?: {
	debug?: boolean,
}, isChild?: true)
{
	options ??= {};
	let map = {} as Record<string, string>

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

		map[rootStart + '/'] = stat.cid.toString();

		options.debug && debug(map, rootStart + '/');
	}

	for await (const entry of ipfs.files.ls(rootStart, {
		timeout: 2000,
	}))
	{
		let path = `${rootStart}/${entry.name}`
		let c = '';
		if (entry.type === 'directory')
		{
			c = '/';
		}

		map[path + c] = entry.cid.toString();
		options.debug && debug(map, path + c);

		if (entry.type === 'directory')
		{
			Object.entries(await deepList(ipfs, path, options, true).catch(e => ({} as null)))
				.forEach(([path, cid]) =>
				{
					map[path] = cid;
				})
			;
		}
	}

	return map
}

function debug(map: Record<string, string>, path: string)
{
	console.debug(`deepList`, path, map[path])
}
