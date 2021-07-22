import { Router } from 'express';
import { ITSPickExtra, ITSRequiredPick } from 'ts-type/lib/type/record';
import { ISharedHandlerOptions } from 'calibre-server/lib/types';
import console from 'debug-color2/logger';
import { addBook } from 'calibre-server/lib/opds/db';
import initMain, { buildAsync, buildSync } from 'calibre-opds/lib/index';
import { Entry, Feed, Link } from 'opds-extra/lib/v1';
import { EnumLinkRel, EnumMIME } from 'opds-extra/lib/const';
import { addOpenSearch } from '../../../lib/opds/search';
import Bluebird from 'bluebird';
import { IBook } from 'calibre-db/lib/types';
import moment from 'moment';
import zhRegExp from '../../../lib/re';
import { slugify } from 'cjk-conv/lib/zh/table/list';

export function calibreSearchFeed(options: ITSPickExtra<ISharedHandlerOptions, 'dbList' | 'pathWithPrefix'>, argv: {
	searchTerms: string,
})
{
	return buildAsync<Feed>(initMain({
		title: `書庫：${options.siteTitle ?? 'Calibre 書庫'}`,
		icon: '/favicon.ico',
	}), [

		(feed) => addOpenSearch(feed, 'calibre'),

		(feed) =>
		{
			feed.books ||= [];

			Object.entries(options.dbList)
				.forEach(([id, row]) => {

					feed.books.push(Entry.deserialize<Entry>({
						title: `書庫：${row.name}`,
						links: [
							{
								href: options.pathWithPrefix.call(void 0, row.id, 'opds'),
								title: EnumLinkRel.ALTERNATE,
								type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
							} as Link
						]
					}));

				})
			;

			return feed
		},

		async (feed) =>
		{
			feed.books ||= [];

			let { searchTerms } = argv;
			let searchTermsRe: RegExp;
			let searchTermsSlugify = slugify(searchTerms);

			try
			{
				searchTermsRe = zhRegExp.create(argv.searchTerms, 'ig')
			}
			catch (e)
			{

			}

			console.dir({
				searchTerms,
				searchTermsRe,
				searchTermsSlugify,
			})

			await Bluebird.resolve(Object.entries(options.dbList))
				.reduce(async (ls, [dbID, row]) => {

					const db = await row.lazyload();

					await (db.getBooks() as Bluebird<any[]>)
						.catch(e => [])
						.each<IBook & {
							dbID: string,
							timestamp: number,
						}>(book => {

							book.dbID = dbID;
							book.timestamp = moment(book.book_timestamp).valueOf();

							if (
								searchTermsRe?.test(book.book_title)
								|| book.book_title.includes(searchTerms)
								|| slugify(book.book_title).includes(searchTermsSlugify)
							)
							{
								ls.push(book);
							}

						})
					;

					return ls
				}, [] as (IBook & {
					dbID: string,
					timestamp: number,
				})[])
				.then(books => {

					books = books.sort((a, b) => b.timestamp - a.timestamp);

					feed.updated = books[0].timestamp;

					return books
				})
				.each(book => {

					let entry = addBook(book, options, {
						dbID: book.dbID,
					});

					entry.authors ??= [];

					entry.authors.unshift({
						name: book.dbID
					} as any)

					feed.books.push(entry)

				})
			;

			return feed
		},

	]);
}

export function calibreSearchHandler(options: ITSRequiredPick<ISharedHandlerOptions, 'dbList' | 'pathWithPrefix' |'siteTitle'>)
{
	const router = Router();

	router.use('/:searchTerms', async (req, res, next) => {

		let { searchTerms } = req.params;

		let feed = await calibreSearchFeed(options, {
			searchTerms,
		});

		res.setHeader('Content-Type', 'application/xml');
		res.send(feed.toXML());
	});

	return router
}

export default calibreSearchHandler
