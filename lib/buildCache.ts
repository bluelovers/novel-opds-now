/**
 * Created by user on 2020/1/30.
 */

import Segment from 'novel-segment/lib';
import { outputJSON } from 'fs-extra';
import { join } from 'path';
import __root from './__root';
import { statSync } from 'fs-extra';
import { existsSync } from 'fs';

function buildCache()
{
	let __cache = join(__root, `.cache/cache.json`);

	if (existsSync(__cache))
	{
		try
		{
			let st = statSync(__cache);

			let md = (Date.now() - st.mtimeMs) / 1000;
			if (md < 3600)
			{
				return Promise.resolve(console.log(`[Segment][Cache] 距離上次緩存已過 ${md}s`))
			}
		}
		catch (e)
		{

		}
	}

	const CACHED_SEGMENT = createSegment();

	CACHED_SEGMENT.doSegment('');

	return outputJSON(__cache, CACHED_SEGMENT.DICT)
		.then(() => {
			console.log('[Segment][Cache] build done')
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

