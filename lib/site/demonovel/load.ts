/**
 * Created by user on 2020/2/3.
 */

import { pathPrefix, ISiteIDs } from '../types';
import Bluebird from 'bluebird';
import { readJSON } from 'fs-extra';
import { INovelStatCache } from '@node-novel/cache-loader';
import { join } from 'path';

export const siteID = `demonovel`;

export function getLocalFilename(file: string = `novel-stat.json`)
{
	return join(pathPrefix.cache, siteID, file);
}

export function loadCache<T = INovelStatCache>(file?: string)
{
	return Bluebird.resolve<T>(readJSON(getLocalFilename(file)))
}

export default loadCache
