import { join, basename } from "path";
import __root from '../__root';

export type ISiteIDs = keyof typeof id_titles_map | keyof typeof builded_map;

export const id_titles_map = {
	dmzj: 'cached-dmzj/data/novel/id_titles.json',
	esjzone: 'cached-esjzone/data/novel/id_titles.json',
	//masiro: 'cached-masiro/data/novel/id_titles.json',
	wenku8: 'cached-wenku8/data/novel/id_titles.json',
};

export const id_update_map = {
	dmzj: 'cached-dmzj/data/novel/id_update.json',
	esjzone: 'cached-esjzone/data/novel/id_update.json',
	//masiro: 'cached-masiro/data/novel/id_update.json',
	wenku8: 'cached-wenku8/data/novel/id_update.json',
};

export const id_chapters_map = {
	dmzj: 'cached-dmzj/data/novel/id_chapters.json',
	esjzone: 'cached-esjzone/data/novel/id_chapters.json',
	//masiro: 'cached-masiro/data/novel/id_chapters.json',
	wenku8: 'cached-wenku8/data/novel/id_chapters.json',
};

export const builded_map = {
	dmzj: 'builded.json',
	esjzone: 'builded.json',
	masiro: 'builded.json',
	wenku8: 'builded.json',
};

export const pathPrefix = {
	module: '@node-novel/',
	github: 'https://github.com/bluelovers/ws-rest/raw/master/packages/%40node-novel/',
	cache: join(__root, '.cache', 'cached') + '/',
};

export function getLocalFilename(siteID: ISiteIDs, map: Record<ISiteIDs, string>)
{
	return `${pathPrefix.cache}${siteID}/${basename(map[siteID])}`;
}


