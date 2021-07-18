import { buildSync, initMain } from 'calibre-opds/lib';
import { OPDSV1 } from 'opds-extra';
import { EnumLinkRel, EnumMIME } from 'opds-extra/lib/const';
import { Link, Entry } from 'opds-extra/lib/v1/core';
import loadCache from './load';
import { createFromJSON, IFilterNovelData, createMoment } from '@node-novel/cache-loader';
import dotValues2 from 'dot-values2'
import NodeNovelInfo from 'node-novel-info/class';
import { moment } from 'novel-downloader/src/site';
import MIMETypes from "mime-types";
import addCover from '../../opds/addCover';
import { makeOPDSShared } from '../../opds/index';
import { IFilterNovelDataPlus, rawUrl, siteID } from './types';
import { addOpenSearch } from '../../opds/search';
import { ISiteIDs } from '../types';
import { getDemoEpubRouterUrl, getDemoEpubUrl } from './getDemoEpubUrl';

export let prefix = `/demo`;
export let prefixRoot = `/opds` + prefix;
export let title = `demonovel`;

export async function makeOPDSType(type: string)
{
	let feed = await makeOPDSPortal();

	//let mainCache = await loadCache();

	let last_updated: number;

	switch (type)
	{
		default:

			await loadCache<IFilterNovelDataPlus[]>('array.json')
				.each((novel, id) => {

					if (!novel.cache.epub_basename)
					{
						return;
					}

					let href = getDemoEpubRouterUrl(novel);
					2

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

					let entry = Entry.deserialize<Entry>({
						// @ts-ignore
						title: novel.title,
						links,
						identifier: novel.uuid,
					});

					if (novel.cache.epub_date)
					{
						entry.updated = createMoment(novel.cache.epub_date);
					}

					if (novel.authors && novel.authors.length)
					{
						// @ts-ignore
						entry.authors = novel.authors.map(name => ({name}))
					}

					if (novel.mdconf.novel?.preface)
					{
						// @ts-ignore
						//entry.summary = novel.mdconf.novel.preface;

						// @ts-ignore
						entry.content = {
							value: novel.mdconf.novel.preface
								.replace(/\n/g, '<br/>')
						}
					}

					entry.subtitle = novel.mdconf.novel.title;

					// @ts-ignore
					last_updated ??= entry.updated;

					feed.books.push(entry);
				})
			;

			feed.updated = last_updated;

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

		(feed) => addOpenSearch(feed, siteID),

		makeOPDSShared,

		(feed) =>
		{

			feed.books.push(Entry.deserialize<Entry>({
				title: `書庫：${siteID}`,
				links: [
					{
						href: `${prefixRoot}.xml`,
						title: EnumLinkRel.ALTERNATE,
						type: EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
					} as Link,
				],
			}));

			feed.books.push(Entry.deserialize<Entry>({
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
