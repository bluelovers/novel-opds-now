import { fromBuffer, FileTypeResult } from 'file-type';

export async function fixFileTypeResult(result: FileTypeResult)
{
	if (!result)
	{
		return result
	}

	let { mime, ext } = result;

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
		...result,
		mime,
		ext,
	}
}

export async function mimeFromBuffer(buffer: Buffer)
{
	return fromBuffer(buffer).then(fixFileTypeResult)
}
