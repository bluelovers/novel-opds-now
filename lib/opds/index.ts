import { initMain, buildSync, buildAsync } from 'calibre-opds/lib';
import { ISiteIDs, builded_map } from '../site/types';
import { EnumLinkRel, EnumMIME } from 'opds-extra/lib/const';
import { Link } from 'opds-extra/lib/v1/core';
import { OPDSV1 } from 'opds-extra';
import { prefixRoot as prefixDemo, title as titleDemo } from '../site/demonovel/opds';
import { addOpenSearch, filterOPDSBook } from './search';
import { cn2tw_min } from '../cn2tw_min';
import addCover from './addCover';
import { addContent } from './addContent';
import { loadCache } from '../site/cached-data/load';
import { createMoment } from '@node-novel/cache-loader';
import { Entry, Feed } from 'opds-extra/lib/v1/core';

export function makeOPDSShared(feed: Feed, msg: string = ''): Feed
{
	feed.books = feed.books || [];

	feed.books.push(Entry.deserialize<Entry>({
		title: `所有書庫${msg}`,
		links: [
			{
				href: `/opds`,
				title: EnumLinkRel.ALTERNATE,
				type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
			} as Link,
		],
	}));

	return feed
}

export function makeOPDSSite(siteID: ISiteIDs)
{
	let last_updated: number;

	return buildAsync(initMain({
		title: `書庫：${siteID}`,
		subtitle: `EPub 自動生成：${siteID}`,
		icon: '/favicon.ico',
	}), [

		(feed) => addOpenSearch(feed, siteID),

		(feed) => makeOPDSShared(feed, `，目前位於 ${siteID}`),

		async (feed) =>
		{
			feed.books = feed.books || [];

			await loadCache(siteID, null)
				.each(({
					id,
					title,
					cover,
					content,
					updated,
				}) => {

					last_updated ??= updated;

					if (siteID === 'esjzone')
					{
						title = cn2tw_min(title, {
							safe: false,
						});
					}

					// @ts-ignore
					feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
						title,
						// @FIXME: 靜讀天下不知道為什麼只能用作者顯示
						authors: [
							{
								name: siteID,
							} as any,
						],
						identifier: `book_${siteID}_${id}`,
						links: [
							...addCover(cover),
							{
								rel: EnumLinkRel.ACQUISITION,
								href: `/file/${siteID}/${id}`,
								type: EnumMIME.epub,
							} as any,
						],
						content: addContent(content),
						updated,
					}));

				})
			;

			return feed
		},

		/*
		(feed) => filterOPDSBook(feed, {
			searchTerms,
		}),
		 */

		(feed) => {

			feed.updated = last_updated;

			return feed
		},

	])
}

export function makeOPDSPortal()
{
	return buildSync(initMain({
		title: `EPub 自動生成`,
		subtitle: `EPub 自動生成`,
		icon: '/favicon.ico',
	}), [

		(feed) => addOpenSearch(feed, 'all'),

		(feed) =>
		{
			feed.books = feed.books || [];

			if (0)
			{
				// @ts-ignore
				feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
					title: `書庫：${titleDemo}`,
					links: [
						{
							href: `https://demonovel.netlify.com/static/opds.xml`,
							title: EnumLinkRel.ALTERNATE,
							type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
						} as Link,
					],
				}));
			}
			else
			{
				// @ts-ignore
				feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
					title: `書庫：${titleDemo}`,
					links: [
						{
							href: `${prefixDemo}/all.xml`,
							title: EnumLinkRel.ALTERNATE,
							type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
						} as Link,
					],
				}));
			}

			Object.keys(builded_map)
				.forEach((siteID) =>
				{

					// @ts-ignore
					feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
						title: `書庫：${siteID}`,
						links: [
							{
								href: `/opds/${siteID}.xml`,
								title: EnumLinkRel.ALTERNATE,
								type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
							} as Link,
						],
					}));

				})
			;

			// @ts-ignore
			feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
				title: `模組：Calibre`,
				links: [
					{
						href: `/opds/calibre.xml`,
						title: EnumLinkRel.ALTERNATE,
						type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
					} as Link,
				],
			}));

			// @ts-ignore
			feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
				title: `書庫：other`,
				links: [
					{
						href: `/opds/other.xml`,
						title: EnumLinkRel.ALTERNATE,
						type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
					} as Link,
				],
			}));

			return feed
		},
	])
}

export default makeOPDSPortal

