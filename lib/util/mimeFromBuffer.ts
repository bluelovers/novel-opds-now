import { fileTypeFromBuffer as fromBuffer, FileTypeResult, MimeType } from 'file-type';
import { FileExtension } from 'file-type/core';
import { lookup } from 'mime-types';
import { isBookFile } from 'calibre-server/lib/util/isBookFile';

export async function fixFileTypeResult(result: FileTypeResult, fileExt?: string | FileExtension)
{
	if (!result)
	{
		return result
	}

	let { mime, ext } = result;

	fileExt = fileExt?.replace?.(/^\./, '') as FileExtension;

	if (fileExt?.length && isBookFile(fileExt))
	{
		let mime2 = lookup(fileExt) as any as MimeType;

		ext = fileExt as FileExtension

		if (mime2)
		{
			mime = mime2 || mime
		}
	}

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

export async function mimeFromBuffer(buffer: Buffer, ext?: string | FileExtension)
{
	return fromBuffer(buffer).then(result => fixFileTypeResult(result, ext))
}
