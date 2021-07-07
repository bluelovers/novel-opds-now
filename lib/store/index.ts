/**
 * Created by user on 2020/2/21.
 */

import { getIPFSEpubFile, putIPFSEpubFile } from './ipfs';

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
