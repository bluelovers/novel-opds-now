/**
 * Created by user on 2020/2/21.
 */

//import { getGunEpubFile, getGunEpubFile2, putGunEpubFile } from './gun';

import { getIPFSEpubFile, putIPFSEpubFile } from './ipfs';

export {
	getIPFSEpubFile as getGunEpubFile,
}

export function getGunEpubFile2(...argv: Parameters<typeof getIPFSEpubFile>)
{
	return getIPFSEpubFile(...argv)
		.then(data => {
			if (data)
			{
				data.isGun = true;
			}
			return data
		})
	;
}

export {
	putIPFSEpubFile as putGunEpubFile
}
