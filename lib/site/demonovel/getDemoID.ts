import { IFilterNovelDataPlus, siteID } from './types';
import newNovelUUID from '@demonovel/uuid';

export function _getDemoID(novel: IFilterNovelDataPlus)
{
	return `${novel.pathMain_base}/${novel.novelID}`
}

export function getDemoUUID(novel: IFilterNovelDataPlus)
{
	return newNovelUUID(siteID, _getDemoID(novel))
}
