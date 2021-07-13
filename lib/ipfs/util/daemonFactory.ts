import { join } from 'path';
import { tmpPath } from '../../util/tmpPath';
import tmpDir from '../../util/tmpDir';
import ipfsEnv from 'ipfs-env';
import { createFactory } from 'ipfsd-ctl';
import { IIPFSControllerDaemon } from '../types';

export async function daemonFactory(disposable: boolean, options?: {
	disposable?: boolean,
})
{
	if (disposable || 1 && !process.env.IPFS_PATH)
	{
		let base = join(tmpPath(), 'novel-opds-now');

		if (disposable)
		{
			process.env.IPFS_PATH = tmpDir(base).name;
		}
		else
		{
			process.env.IPFS_PATH = join(base, '.ipfs');
		}
	}

	const myFactory: {
		opts: IIPFSControllerDaemon["opts"],
		spawn(): IIPFSControllerDaemon,
	} = createFactory({
		ipfsHttpModule: await import('ipfs-http-client'),
		ipfsBin: ipfsEnv().IPFS_GO_EXEC || await import('go-ipfs').then(m => m.path()),
		ipfsOptions: {
			EXPERIMENTAL: {
				ipnsPubsub: true,
				repoAutoMigrate: true,
			},
			//init: true,
			start: false,
		},
		...options,
		disposable: false,
		//test: disposable,
	});

	const ipfsd = await myFactory.spawn() as IIPFSControllerDaemon

	return {
		myFactory,
		ipfsd,
	}
}
