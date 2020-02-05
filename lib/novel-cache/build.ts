import loadCache from './load';
import {
	ISiteIDs,
	pathPrefix,
	id_titles_map,
	id_update_map,
	getLocalFilename,
	builded_map,
	id_chapters_map,
} from './types';
import Bluebird from 'bluebird';
import { updateCache } from './update';
import { outputJSON } from 'fs-extra';

export function buildSortAll()
{
	return Bluebird.resolve(Object.keys(id_titles_map))
		.map((siteID) => buildSort(siteID as any))
}

export function buildSort(siteID: ISiteIDs)
{
	return Bluebird.props({
			id_titles: loadCache<Record<string, string>>(siteID, id_titles_map),
			id_update: loadCache<string[]>(siteID, id_update_map),
			id_chapters: loadCache<string[]>(siteID, id_chapters_map),
		})
		.then(({
			id_titles,
			id_update,
			id_chapters,
		}) =>
		{
			return (id_update as string[])
				.filter(id => id_chapters[id] > 0)
				.map((id) => ({
					id,
					title: (id_titles as Record<string, string>)[id],
				}))
		})
		.then(data =>
		{
			return outputJSON(getLocalFilename(siteID, builded_map), data, {
				spaces: 2,
			})
		})
		;
}

export default buildSortAll
