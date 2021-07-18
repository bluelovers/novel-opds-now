import { IFilterNovelDataPlus, rawUrl } from './types';

export function getDemoEpubUrl(novel: IFilterNovelDataPlus)
{
	return new URL([
		novel.pathMain_base,
		novel.cache.epub_basename,
	].join('/'), rawUrl)
}
