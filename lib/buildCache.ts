/**
 * Created by user on 2020/1/30.
 */

import Segment from 'novel-segment/lib';
import { outputJSON } from 'fs-extra';
import { join } from 'path';

function buildCache()
{
	const CACHED_SEGMENT = createSegment();

	CACHED_SEGMENT.doSegment('');

	return outputJSON(`${__dirname}/../.cache/cache.json`, CACHED_SEGMENT.DICT)
		.then(() => {
			console.log('[buildCache] done')
		})
}

function createSegment()
{
	return new Segment({
		autoCjk: true,
		optionsDoSegment: {
			convertSynonym: true,
		},
		all_mod: true,
	});
}

export default buildCache();

