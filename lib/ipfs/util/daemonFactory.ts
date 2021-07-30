import { join } from 'path';
import { tmpPath } from '../../util/tmpPath';
import tmpDir from '../../util/tmpDir';
import ipfsEnv from 'ipfs-env';
import { createFactory } from 'ipfsd-ctl';
import { IIPFSControllerDaemon, IUseIPFSOptions } from '../types';

export async function daemonFactory(disposable: boolean, options?: IUseIPFSOptions)
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
		ipfsHttpModule: await import('ipfs-http-client')
//			.then(m =>
//			{
//
//				const old = m.create;
//
//				return {
//					...m,
//					create(options)
//					{
//						if (typeof options === 'string')
//						{
//							options = {
//								url: options,
//							}
//						}
//
//						options ??= {};
//						options.timeout ??= 10000;
//
//						return old(options)
//					},
//				}
//			})
		,
		ipfsBin: ipfsEnv().IPFS_GO_EXEC || await import('go-ipfs').then(m => m.path()),
		ipfsOptions: {
			EXPERIMENTAL: {
				ipnsPubsub: true,
				repoAutoMigrate: true,
			},
			//init: true,
			start: false,
		},
		...(options?.factoryOptions ?? {}),
		disposable: false,
		//test: disposable,
		forceKill: true,
		forceKillTimeout: 3000,
		args: [
			'--enable-gc',
		]
	});

	const ipfsd = await myFactory.spawn() as IIPFSControllerDaemon

	return {
		myFactory,
		ipfsd,
	}
}
