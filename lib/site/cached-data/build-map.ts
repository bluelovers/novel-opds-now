import { outputJSON } from 'fs-extra';
import { getCacheFilename } from '../../util/index';
import { ISiteIDs, ISiteIDsPlus } from '../types';
import { INovelDataSimple } from './types';
import { ITSKeyOfRecordExtractToKey } from 'ts-type/lib/helper/record';

export function _buildMap<T extends Record<string, any>>(siteID: ISiteIDsPlus, list: T[], key?: ITSKeyOfRecordExtractToKey<T, string>)
{
	key ??= 'id' as ITSKeyOfRecordExtractToKey<T, string>;

	return outputJSON(getCacheFilename(`${siteID}/map.json`), list.reduce((a, b) => {

		// @ts-ignore
		a[b[key]] = b;

		return a
	}, {}), {
		spaces: 2,
	})
}
