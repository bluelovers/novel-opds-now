import { ISiteIDs, getLocalFilename } from './types';
import { readJSON } from 'fs-extra';
import Bluebird from 'bluebird';

export function loadCache<T>(siteID: ISiteIDs, map: Record<ISiteIDs, string>)
{
	return Bluebird.resolve<T>(readJSON(getLocalFilename(siteID, map)))
}

export default loadCache
