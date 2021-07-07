import { pathExists } from 'fs-extra';
import { join } from 'path';

export function repoExists(repoPath: string)
{
	return pathExists(join(repoPath, 'config'))
}
