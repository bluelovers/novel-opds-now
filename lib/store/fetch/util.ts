import Bluebird from 'bluebird';
import { mimeFromBuffer } from '../../util/mimeFromBuffer';
import console from 'debug-color2/logger';

const SymbolSource = Symbol.for('href');

export function assertEpubByMime(buffer: Buffer)
{
	return Bluebird.resolve()
		.tap(async () => {
			let { mime, ext } = await mimeFromBuffer(buffer);

			if (ext !== 'epub' && ext !== 'zip')
			{
				throw new TypeError(JSON.stringify({ mime, ext }))
			}
		})
		.tapCatch(e => {
			e.href = e[SymbolSource] = buffer?.[SymbolSource].toString();
			console.error(`assertEpubByMime`, buffer?.length, e[SymbolSource]);
			if (buffer?.length)
			{
				console.error(e);
				console.trace()
			}
		})
}
