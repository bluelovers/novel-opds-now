import { resolve } from 'path';
import __root from '../__root';

export function tmpPath()
{
	let env = process?.env;
	return resolve(env?.YARN_CACHE_FOLDER || env?.TEMP || __root, 'tmp')
}
