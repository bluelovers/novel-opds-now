import { mimeFromBuffer } from '../../util/mimeFromBuffer';

export async function assertEpubByMime(buffer: Buffer)
{
	let { mime, ext } = await mimeFromBuffer(buffer);

	if (ext !== 'epub' && ext !== 'zip')
	{
		return Promise.reject(new Error(JSON.stringify({ mime, ext })))
	}
}
