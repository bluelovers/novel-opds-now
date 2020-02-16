/**
 * Created by user on 2020/2/16.
 */

import Segment from 'novel-segment/lib/Segment';

export function createSegment()
{
	return new Segment({
		autoCjk: true,
		optionsDoSegment: {
			convertSynonym: true,
		},
		all_mod: true,
		nodeNovelMode: true,
	});
}

export default createSegment
