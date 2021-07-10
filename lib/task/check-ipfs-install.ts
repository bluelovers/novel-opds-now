/**
 * Created by user on 2021/7/10.
 */
import Bluebird from 'bluebird';
import { dirname } from 'path';
//import console from 'debug-color2/logger';

export function checkIpfsInstall()
{
	return Bluebird.resolve<{
			path(): string,
		}>(import('go-ipfs'))
		.then(m => {
			return Bluebird.resolve(m).then(m => m.path())
				//.tap(m => Promise.reject('debug test'))
				.catch(async (e) => {
					console.warn(`checkIpfsInstall`, String(e))

					let cwd = dirname(require.resolve('go-ipfs/package.json'));

					const download: (version?: string, platform?: string, arch?: string, installPath?: string) => string = await import('go-ipfs/src/download').then(m => m.default ?? m);
					return download(null, null, null, cwd)
				})
				.catch(async (e) => {
					// Error: EEXIST: file already exists, symlink
					return Promise.resolve().then(() => m.path()).catch(() => Promise.reject(e))
				})
		})
	;
}
