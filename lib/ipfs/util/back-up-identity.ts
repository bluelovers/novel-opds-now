
import { join } from 'path';
import Bluebird from 'bluebird';
import { outputJSON, readJSON } from 'fs-extra';
import { __root } from '../../const';
import { IIPFSControllerDaemon } from '../types';
import {
	assertIdentity,
	backupIdentityFromRepoToFile,
	getIdentityPath,
	readIdentityFile,
	readIdentityFromRepoConfig, restoreIdentityFromFileSync,
	setIdentityToRepoConfig,
	writeIdentityFile,
} from '@lazy-ipfs/identity';

const FILE_IDENTITY = getIdentityPath(join(__root, 'test'));

export { FILE_IDENTITY }

export async function backupIdentity(ipfsd: IIPFSControllerDaemon)
{
	return backupIdentityFromRepoToFile(ipfsd.path, FILE_IDENTITY)
}

export function restoreIdentity(ipfsd: IIPFSControllerDaemon)
{
	return restoreIdentityFromFileSync(ipfsd.path, FILE_IDENTITY)
}
