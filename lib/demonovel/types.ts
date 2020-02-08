/**
 * Created by user on 2020/2/3.
 */
import { createFromJSON, IFilterNovelData, createMoment } from '@node-novel/cache-loader';


export interface IOutputFile
{
	[title: string]: {
		siteID: string,
		id: string,
	}[]
}

export interface IFilterNovelDataPlus extends IFilterNovelData
{
	title: string
	authors: string[]
}
