/**
 * Created by user on 2021/7/10.
 */
import Bluebird from 'bluebird';
//import console from 'debug-color2/logger';

export function checkIpfsInstall()
{
	return Bluebird.resolve<{
			path(): string,
		}>(import('go-ipfs'))
		.then(m => m.path())
		//.tap(m => Promise.reject('debug test'))
		.catch(async (e) => {
			console.warn(`checkIpfsInstall`, String(e))

			const download: () => string = await import('go-ipfs/src/download').then(m => m.default ?? m);
			return download()
		})
	;
}
