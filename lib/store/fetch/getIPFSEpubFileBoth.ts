import { IGunEpubData } from '../../types';
import Bluebird from 'bluebird';
import { getIPFSEpubFile } from '../ipfs';
import { fetchEpub } from './fetchEpub';
import console from 'debug-color2/logger';

export function getIPFSEpubFileBoth(siteID: string, novelID: string, options: {
	query?: {
		debug?: boolean,
		force?: boolean,
	},
	href: string,
	filename: string,
	timestamp: number,
})
{
	return Bluebird.resolve()
		.then(async () => {

			const { href, filename } = options;

			console.info(`檢查是否存在緩存...`, siteID, novelID, filename, href);

			return Bluebird.any([
						getIPFSEpubFile(siteID, novelID, {
							query: options.query,
						}).then<Buffer>(gunData => {
							if (gunData.exists)
							{
								return Buffer.from(gunData.base64)
							}

							return Promise.reject(new Error(`下載緩存檔案失敗... ${filename}`))
						}),
						fetchEpub(href, 5 * 60 * 1000),
					])
					.then<IGunEpubData>(buf => {

						if (buf.length)
						{
							return <IGunEpubData>{
								filename,
								exists: true,
								timestamp: options.timestamp,
								href,
								isGun: true,
								base64: Buffer.from(buf),
							};
						}

						return Promise.reject(new Error(`下載緩存檔案失敗... ${filename}`))
					})
			;
		})
	;
}
