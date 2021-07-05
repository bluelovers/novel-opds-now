import { OPDSV1 } from 'opds-extra';
import { EnumLinkRel, EnumMIME } from 'opds-extra/lib/const';
import { Link } from 'opds-extra/lib/v1/core';
import { ISiteIDs, builded_map } from '../site/types';
import { buildAsync, initMain } from 'calibre-opds/lib';
import { makeOPDSShared } from './index';
import { addOpenSearch } from './search';
import { Entry, Feed } from 'opds-extra/lib/v1/core';

export function makeOPDSOtherSource(feed: Feed): Feed
{
	feed.books = feed.books || [];

	[
		{
			title: 'D Genesis 迷宮出現三年後',
			href: `https://novel.tyty.moe/artifacts/n7945fn/epub/n7945fn_latest.epub`
		},
		{
			title: '關於鄰家的天使大人不知不覺把我慣成了廢人這檔子事',
			href: `https://novel.tyty.moe/artifacts/n8440fe/epub/n8440fe_latest.epub`
		},
	]
		.forEach(({
			title,
			href,
		}) => {

			feed.books.push(Entry.deserialize<Entry>({
				title,
				links: [
					{
						rel: EnumLinkRel.ACQUISITION,
						href,
						type: EnumMIME.epub,
					} as any
				],
			}));

		})
	;

	return feed
}

export function makeOPDSOther()
{
	return buildAsync(initMain({
		title: `書庫：other`,
		icon: '/favicon.ico',
	}), [

		(feed) => addOpenSearch(feed, 'other'),

		(feed) => makeOPDSShared(feed, `，目前位於 other`),
		makeOPDSOtherSource,

	])
}
