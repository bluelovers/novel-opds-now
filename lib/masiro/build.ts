/**
 * Created by user on 2020/6/14.
 */
import { updateCache, updateCache2 } from './update';
import Bluebird from 'bluebird';
import newNovelUUID from '@demonovel/uuid';



export function buildCache()
{
	return Bluebird.props({
		table: updateCache(),
		table_update: updateCache2(),
	})
		.then(({
			table,
			table_update,
		}) => {

			const siteID = 'masiro';

			return Object.entries(table_update)
				.sort((a, b) => b[1] - a[1])
				.reduce((a, [id, value]) => {

					let uuid = newNovelUUID(siteID, id)

					let row = table[uuid];

					if (row.title)
					{
						a.push({
							id,
							title: row.title,
						})
					}

					return a
				}, [] as {
					id: string,
					title: string,
				}[])
			;

		})
	;
}

