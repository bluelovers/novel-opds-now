/**
 * Created by user on 2020/1/30.
 */
import Segment, { IOptionsDoSegment } from 'novel-segment/lib/segment/core';
import { useModules } from 'novel-segment/lib/segment/methods/useModules2';
import getDefaultModList from 'novel-segment/lib/mod';
import __root from './__root';
import createSegment from './segment/createSegment';

let CACHED_SEGMENT: Segment;

async function getSegment()
{
	if (CACHED_SEGMENT)
	{
		return CACHED_SEGMENT;
	}

	const DICT = await import(`${__root}/.cache/cache.json`).then(v => v.default || v) as any;

	CACHED_SEGMENT = createSegment();

	useModules(CACHED_SEGMENT as any, getDefaultModList(CACHED_SEGMENT.options.all_mod));

	CACHED_SEGMENT.DICT = DICT;
	CACHED_SEGMENT.inited = true;

	return CACHED_SEGMENT
}

function doSegment(text: string, options?: IOptionsDoSegment)
{
	return getSegment().then(v => v.doSegment(text, {
		...options,
		simple: true,
	}).join(''))
}

export default doSegment
