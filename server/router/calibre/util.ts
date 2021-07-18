import { basename, extname } from "path";
import { IBook } from 'calibre-db/lib/types';
import { isBookFile } from 'calibre-server/lib/util/isBookFile';

export function pathWithPrefix(this: IBook, a = '', ...input)
{
	let prefix = '/opds/calibre';
	let query: string = '';

	if (input.length)
	{
		let index = input.length - 1;
		let last = input[index];
		let ext = extname(last);

		if (ext)
		{
			prefix = '/file/calibre';

			if (this?.book_title?.length)
			{
				input.unshift(this.book_id)

				let name = basename(last);
				let author = this.authors?.[0]?.author_name ?? 'unknown';

				let p = new URLSearchParams();

				if (ext === '.jpg')
				{
					p.set('filename', `${this.book_title} - ${author} - ${name}`);
					query = '?' + p.toString()
				}
				else if (ext === '.epub' || isBookFile(ext.replace(/^\./, '')))
				{
					p.set('filename', `${this.book_title} - ${author}${ext}`);
					query = '?' + p.toString()
				}
			}
		}
	}

	return [prefix, a, ...input].join('/') + query;
}
