import { fromBuffer } from 'file-type';

export async function mimeFromBuffer(buffer: Buffer)
{
	let { mime, ext } = await fromBuffer(buffer);

	if (mime === 'application/zip')
	{
		if (ext === 'zip')
		{
			mime = 'application/epub+zip' as const;
			ext = 'epub' as const;
		}
		else if (ext === 'epub')
		{
			mime = 'application/epub+zip' as const;
		}
	}

	return {
		mime,
		ext,
	}
}
