/**
 * Created by user on 2020/2/1.
 */

import Bluebird from 'bluebird';
import { dirSync } from 'tmp';
import { OUTPUT_DIR } from './const';
import { join } from "path";
import { pathExistsSync } from 'fs-extra';
import { spawnSync } from "child_process";

export function tmpDir(outputDir?: string)
{
	if (outputDir == null)
	{
		if (process.env.YARN_CACHE_FOLDER)
		{
			outputDir = join(process.env.YARN_CACHE_FOLDER, 'tmp')
		}
		else if (process.env.TEMP)
		{
			outputDir = join(process.env.TEMP, 'tmp')
		}
	}

	return dirSync({
		unsafeCleanup: false,
		dir: outputDir,
		// @ts-ignore
		tmpdir: outputDir,
	});
}

export default tmpDir
