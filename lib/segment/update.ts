import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
import { getCacheFilename } from '../util';
import console from 'debug-color2/logger';
import fetch from '../fetch';
import { getSegment } from '../doSegment';
import { file } from './const';

const url = `https://github.com/bluelovers/ws-segment/raw/cache/packages/novel-segment/test/temp/cache.common.synonym.db`;

export function updateSegmentCache(force?: boolean): Bluebird<IRecordCachedJSONRow>
{
	return getLocalOrRebuild(file, {

		console,

		makeFns: [
			() => fetch(url).then(res => res.json()),
			() => getSegment().then(CACHED_SEGMENT => {
				CACHED_SEGMENT.doSegment('')
				return CACHED_SEGMENT.DICT
			}),
		],
	})
}

export default updateSegmentCache
