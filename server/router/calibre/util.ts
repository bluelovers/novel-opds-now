import { extname } from "path";


export function pathWithPrefix(a = '', ...input)
{
	let prefix = '/opds/calibre';

	if (input.length)
	{
		let last = input[input.length-1];

		if (extname(last))
		{
			prefix = '/file/calibre';
		}
	}

	return [prefix, a, ...input].join('/');
}
