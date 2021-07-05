/**
 * Created by user on 2020/6/14.
 */
import { updateCache2 } from './update';
import Bluebird from 'bluebird';
import newNovelUUID from '@demonovel/uuid';
import { updateCache } from '../cached-data/build';

export function buildCache(force?: boolean)
{
	const siteID = 'masiro';

	return Bluebird.props({
			table: updateCache(siteID, force),
			table_update: updateCache2(force),
		})
		.then(({
			table,
			table_update,
		}) =>
		{
			return Object.entries(table_update)
				.sort((a, b) => b[1] - a[1])
				.reduce((a, [id, value]) =>
				{

					let uuid = newNovelUUID(siteID, id)

					let row = table[uuid];

					if (row.title)
					{
						a.push({
							id,
							title: row.title,
							cover: row.cover,
							updated: row.updated,
							content: row.content,
						})
					}

					return a
				}, [] as {
					id: string;
					title: string;
					cover: string;
					updated: number;
					content: string;
				}[])
				;

		})
		;
}

