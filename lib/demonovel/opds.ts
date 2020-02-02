import { buildSync, initMain } from 'calibre-opds/lib';
import { OPDSV1 } from 'opds-extra';
import { EnumLinkRel, EnumMIME } from 'opds-extra/lib/const';
import { Link } from 'opds-extra/lib/v1/core';
import loadCache, { siteID } from './load';
import { createFromJSON, IFilterNovelData, createMoment } from '@node-novel/cache-loader';
import dotValues2 from 'dot-values2'
import NodeNovelInfo from 'node-novel-info/class';
import { moment } from 'novel-downloader/src/site';
import MIMETypes from "mime-types";
import addCover from '../opds/addCover';

export let prefix = `/demo`;
export let prefixRoot = `/opds` + prefix;
export let title = `demonovel`;

export async function makeOPDSType(type: string)
{
	let feed = makeOPDSPortal();

	//let mainCache = await loadCache();
	let rawUrl = 'https://gitlab.com/demonovel/epub-txt/raw/master/';

	switch (type)
	{
		default:

			await loadCache<IFilterNovelData[]>('array.json')
				.each(novel => {

					let href = new URL([
						novel.pathMain_base,
						novel.cache.epub_basename,
					].join('/'), rawUrl);

					let links = [
						{
							rel: EnumLinkRel.ACQUISITION,
							href,
							type: EnumMIME.epub,
						} as any
					];

					if (novel.mdconf.novel && novel.mdconf.novel.cover)
					{
						links.push(...addCover(novel.mdconf.novel.cover));
					}

					let entry = OPDSV1.Entry.deserialize<OPDSV1.Entry>({
						// @ts-ignore
						title: novel.title,
						links,
					});

					if (novel.cache.epub_date)
					{
						entry.updated = createMoment(novel.cache.epub_date);
					}

					feed.books.push(entry);
				})
			;

	}

	return feed
}

export function makeOPDSPortal()
{
	return buildSync(initMain({
		title,
		subtitle: ``,
		icon: '/favicon.ico',
	}), [

		(feed) =>
		{
			feed.books = feed.books || [];

			feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
				title: `所有書庫`,
				links: [
					{
						href: `/opds`,
						title: EnumLinkRel.ALTERNATE,
						type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
					} as Link,
				],
			}));

			feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
				title: `書庫：${siteID}`,
				links: [
					{
						href: `${prefixRoot}.xml`,
						title: EnumLinkRel.ALTERNATE,
						type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
					} as Link,
				],
			}));

			feed.books.push(OPDSV1.Entry.deserialize<OPDSV1.Entry>({
				title: `全部列表`,
				links: [
					{
						href: `${prefixRoot}/all.xml`,
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
