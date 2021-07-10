/**
 * Created by user on 2020/2/1.
 */

import { DirOptions, dirSync } from 'tmp';
import { tmpPath } from './tmpPath';

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
