import { OPDSV1 } from 'opds-extra';
import { ISiteIDs } from '../site/types';
import zhRegExp from '../re';
import { slugify } from 'cjk-conv/lib/zh/table/list';
import { Entry, Feed } from 'opds-extra/lib/v1/core';

export function addOpenSearch(feed: Feed, siteID: ISiteIDs | string)
{
	feed.links = feed.links || [];
	feed.links.push({
		rel: "search",
		href: `/search/${siteID}.xml`,
		type: "application/opensearchdescription+xml",
	} as any)

	return feed
}

export function filterOPDSBook(feed: Feed, searchTermOptions: {
	searchTerms: string,
	onlyBook?: boolean,
})
{
	let { searchTerms } = searchTermOptions;

	if (searchTerms)
	{
		let defaultBool = !searchTermOptions.onlyBook;
		let searchTermsRe: RegExp;

		try
		{
			searchTermsRe = zhRegExp.create(searchTerms, 'ig')
		}
		catch (e)
		{

		}

		feed.books = feed.books
			.filter(book => {

				if (book.identifier && book.identifier.includes('book'))
				{
					if (
						searchTermsRe && searchTermsRe.test(book.title)
						|| book.title.includes(searchTerms)
						|| slugify(book.title).includes(slugify(searchTerms))
					)
					{
						return true;
					}

					return false
				}

				return defaultBool
			})
		;
	}

	return feed;
}
