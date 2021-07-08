/**
 * Created by user on 2020/2/1.
 */

import { DirOptions, dirSync } from 'tmp';
import { join, resolve } from "path";
import __root from './__root';

export function tmpPath()
{
	return resolve(process.env.YARN_CACHE_FOLDER || process.env.TEMP || __root, 'tmp')
}

export function tmpDir(outputDir?: string, options?: DirOptions)
{
	outputDir ??= tmpPath();

	return dirSync({
		...options,
		unsafeCleanup: false,
		dir: outputDir,
		// @ts-ignore
		tmpdir: outputDir,
	});
}

export default tmpDir
