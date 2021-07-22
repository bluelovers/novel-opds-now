import { Request, Response, Router } from 'express';
import { ISharedHandlerOptions } from 'calibre-server/lib/types';
import { NextFunction } from 'express-serve-static-core';
import console from 'debug-color2/logger';
import buildOPDSIndex from 'calibre-server/lib/opds/index';
import buildOPDSID from 'calibre-server/lib/opds/db';
import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { addOpenSearch } from '../../../lib/opds/search';
import moment from 'moment';

export function createLibraryHandler(options: ITSRequiredPick<ISharedHandlerOptions, 'dbList' | 'pathWithPrefix' |'siteTitle'>)
{
	const router = Router();

	console.dir(options.dbList);

	router.use('/+:dbID/*', async (req, res, next) =>
	{
		let { dbID } = req.params;

		if (dbID && options.dbList[dbID])
		{
			console.dir({
				dbID,
				name: options.dbList[dbID].name,
			});

			res.setHeader('Content-Type', 'application/xml');
			let feed = await buildOPDSID(options, { dbID });

			addOpenSearch(feed, 'calibre');

			feed.books.forEach(entry => {

				entry.authors ??= [];

				entry.authors.unshift({
					name: dbID
				} as any)

			})

			res.send(feed.toXML());
		}
		else
		{
			if (dbID)
			{
				console.error(`dbID: ${dbID} 不存在`);
			}

			return next();
		}
	});

	let opdsIndex = async (req: Request, res: Response, next: NextFunction) =>
	{
		res.setHeader('Content-Type', 'application/xml');

		let feed = await buildOPDSIndex(options);

		addOpenSearch(feed, 'calibre');

		feed.updated ||= moment().startOf('day')

		res.send(feed.toXML());
	};

	//router.use('/opds(\.xml)?', opdsIndex);
	router.use('*', opdsIndex);

	/*
	router.use('*', (req: Request, res: Response, next: NextFunction) =>
	{
		return next();
	});
	 */

	return router
}
