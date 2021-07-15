import { basename, extname } from "path";
import { IBook } from 'calibre-db/lib/types';

export function pathWithPrefix(this: IBook, a = '', ...input)
{
	let prefix = '/opds/calibre';
	let query: string = '';

	if (input.length)
	{
		let index = input.length-1;
		let last = input[index];
		let ext = extname(last);

		if (ext)
		{
			prefix = '/file/calibre';

			if (this?.book_title?.length)
			{
				let name = basename(last);

				if (ext === '.jpg')
				{
					let p = new URLSearchParams();
					p.set('filename', `${this.book_title} ${name}`);
					query = '?' + p.toString()
				}
				else if (ext === '.epub')
				{
					let p = new URLSearchParams();
					p.set('filename', `${this.book_title} ${this.authors[0].author_name}${ext}`);
					query = '?' + p.toString()
				}
			}
		}
	}

	return [prefix, a, ...input].join('/') + query;
}
