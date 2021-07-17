import { outputJSON } from 'fs-extra';
import { getCacheFilename } from '../../util/index';
import { ISiteIDs } from '../types';
import { INovelDataSimple } from './types';

export function _buildMap(siteID: ISiteIDs, list: INovelDataSimple[])
{
	return outputJSON(getCacheFilename(`${siteID}/map.json`), list.reduce((a, b) => {

		a[b.id] = b;

		return a
	}, {}), {
		spaces: 2,
	})
}
