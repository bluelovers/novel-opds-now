import { envBool } from 'env-bool';

export function envDisposable(disposable: boolean)
{
	return !!envBool(disposable ?? process.env.IPFS_DISPOSABLE ?? false, true);
}
