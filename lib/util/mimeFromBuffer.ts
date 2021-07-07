import { fromBuffer } from 'file-type';

export async function mimeFromBuffer(buffer: Buffer)
{
	let { mime, ext } = await fromBuffer(buffer);

	if (ext === 'epub' && mime === 'application/zip')
	{
		mime = 'application/epub+zip' as const;
	}

	return {
		mime,
		ext,
	}
}
