
import { IUseIPFSApi } from '../../types';
import { outputJSONSync } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import console from 'debug-color2/logger';
import throttle from 'lodash/throttle';

export const saveMutableFileSystemRoots = throttle(function (ipfs: IUseIPFSApi)
{
	return Promise.resolve(ipfs).then(async () => {

		let record: Record<string, string> = {};
		let length = 0;

		for await (const ret of ipfs.files.ls('/'))
		{
			record[ret.name] = ret.cid.toString()
			length++;
		}

		outputJSONSync(join(__root, 'test', '.mfs.roots.json'), record, {
			spaces: 2,
		});

		console.debug(`[IPFS]`, `saveMutableFileSystemRoots`, length);
	}).catch(e => void 0)
}, 5 * 60 * 1000);
