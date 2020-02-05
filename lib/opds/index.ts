import { initMain, buildSync, buildAsync } from 'calibre-opds/lib';
import { id_titles_map, ISiteIDs, builded_map } from '../novel-cache/types';
import { EnumLinkRel, EnumMIME } from 'opds-extra/lib/const';
import { Link } from 'opds-extra/lib/v1/core';
import { OPDSV1 } from 'opds-extra';
import loadCache from '../novel-cache/load';
import { prefixRoot as prefixDemo, title as titleDemo } from '../demonovel/opds';

export function makeOPDSShared(feed: OPDSV1.Feed, msg: string = ''): OPDSV1.Feed
{
	feed.books = feed.books || [];

	feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
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
	return buildAsync(initMain({
		title: `書庫：${siteID}`,
		subtitle: `EPub 自動生成：${siteID}`,
		icon: '/favicon.ico',
	}), [

		(feed) => makeOPDSShared(feed, `，目前位於 ${siteID}`),

		async (feed) =>
		{
			feed.books = feed.books || [];

			await loadCache<{
				id,
				title,
			}[]>(siteID, builded_map)
				.each(({
					id,
					title,
				}) => {

					feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
						title,
						links: [
							{
								rel: EnumLinkRel.ACQUISITION,
								href: `/file/${siteID}/${id}`,
								type: EnumMIME.epub,
							} as any
						],
					}));

				})
			;

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

		(feed) =>
		{
			feed.books = feed.books || [];

			if (0)
			{
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

			Object.keys(id_titles_map)
				.forEach((siteID) =>
				{

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
