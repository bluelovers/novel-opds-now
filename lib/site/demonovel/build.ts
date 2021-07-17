/**
 * Created by user on 2020/2/3.
 */
import loadCache, { getLocalFilename} from './load';
import { NodeNovelInfo } from 'node-novel-info/class';
import { INovelStatCache, createFromJSON, IFilterNovelData, createMoment } from '@node-novel/cache-loader';
import { removeZeroWidth } from 'zero-width/lib';
import { toHalfWidth } from 'str-util';
import { IOutputFile, IFilterNovelDataPlus, siteID } from './types';
import dotValues2 from 'dot-values2'
import { writeJSON } from 'fs-extra';
import newNovelUUID from '@demonovel/uuid';
import { _buildMap } from '../cached-data/build-map';
import { getDemoUUID, _getDemoID } from './getDemoID';

export function buildCache()
{
	return loadCache()
		.then(table =>
		{

			let nc = createFromJSON(table);

			let novels = nc.filterNovel();

			let list = dotValues2.get(novels, `*.*`) as IFilterNovelDataPlus[];

			list = list
				.map(novel =>
				{
					let info = NodeNovelInfo.create(novel.mdconf);

					novel.title = info.title();

					novel.authors = info.authors();

					novel.uuid = getDemoUUID(novel);
					novel.id = _getDemoID(novel);

					return novel
				})
				.sort((a, b) =>
				{
					if (b.cache.epub_date && a.cache.epub_date)
					{
						return b.cache.epub_date - a.cache.epub_date;
					}
					else if (!b.cache.epub_date && a.cache.epub_date)
					{
						return -1;
					}
					else if (!a.cache.epub_date && b.cache.epub_date)
					{
						return 1;
					}

					return 0
				})
			;

			return Promise.all([
				writeJSON(getLocalFilename('array.json'), list, {
					spaces: 2,
				}),
				_buildMap(siteID, list, 'uuid')
			])
		})
		;
}

export function buildTitleList(cache: IOutputFile)
{
	let titles = Object.keys(cache)
		.reduce((a, s) =>
		{

			let t1 = removeZeroWidth(toHalfWidth(s));

			t1 = [
				/\s+/g,
				/[’'"]+/g,
				/[\\\/\[\]{}()~「」【】、,…・。―〈〉『』—《》（），﹑]+/g,
				/[<>]+/g,
				/[#.?!+·-]+/g,
				/[◆◇■□★▼＊☆◊§～*↣＝=═\-－─—　 ※…⋯◯○~∞&%]+/g,
				/[&=]+/g,
				/[×:@]+/g,
			].reduce((t1, re) =>
			{

				let t2 = t1.replace(re, '');

				if (t2.length)
				{
					return t2;
				}

				return t1
			}, t1);

			a[t1] = a[t1] || [];
			a[t1].push(s);

			return a
		}, {} as Record<string, string[]>)
	;

	let titles_list = Object.keys(titles);

	return {
		titles,
		titles_list,
	}
}

export default buildCache
