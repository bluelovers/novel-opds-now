/**
 * Created by user on 2020/1/30.
 */
import Segment, { IOptionsDoSegment } from 'novel-segment/lib/segment/core';
import { useModules } from 'novel-segment/lib/segment/methods/useModules2';
import getDefaultModList from 'novel-segment/lib/mod';
import __root from './__root';
import createSegment from './segment/createSegment';
import { file } from './segment/const';
import { readJSON } from 'fs-extra';

let CACHED_SEGMENT: Segment;

export function existsSegment()
{
	return !!CACHED_SEGMENT
}

export async function replaceSegmentDict()
{
	if (existsSegment())
	{
		const DICT = await readJSON(file)
			.catch(e => void 0)
		;

		if (Object.keys(DICT).length > 2)
		{
			await useModules(CACHED_SEGMENT as any, getDefaultModList(CACHED_SEGMENT.options.all_mod));

			CACHED_SEGMENT.DICT = DICT;
			CACHED_SEGMENT.inited = true;
		}

		return true
	}
}

export async function getSegment()
{
	if (CACHED_SEGMENT)
	{
		return CACHED_SEGMENT;
	}

	CACHED_SEGMENT = createSegment();

	await replaceSegmentDict();

	return CACHED_SEGMENT
}

export function doSegment(text: string, options?: IOptionsDoSegment)
{
	return getSegment().then(v => v.doSegment(text, {
		...options,
		simple: true,
	}).join(''))
}

export default doSegment
