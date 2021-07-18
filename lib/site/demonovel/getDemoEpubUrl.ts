import { IFilterNovelDataPlus, rawUrl, siteID } from './types';
import { Router } from 'express';

export function getDemoEpubUrl(novel: IFilterNovelDataPlus)
{
	return new URL([
		novel.pathMain_base,
		novel.cache.epub_basename,
	].join('/'), rawUrl)
}

export function getDemoEpubRouterUrl(novel: IFilterNovelDataPlus)
{
	return [
		'',
		'file',
		siteID,
		novel.uuid,
		novel.pathMain_base,
		novel.cache.epub_basename,
	].join('/')
}
