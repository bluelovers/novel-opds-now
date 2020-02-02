/**
 * Created by user on 2020/2/3.
 */

import { lookup } from "mime-types";
import { EnumMIME, EnumLinkRel } from 'opds-extra/lib/const';

export function addCover(href: string)
{
	let type = lookup(href);

	if (!type || !/image/.test(type)) {
		type = EnumMIME.jpg;
	}

	return [
		{
			rel: EnumLinkRel.IMAGE,
			href,
			type,
		},
		{
			rel: EnumLinkRel.IMAGE_THUMBNAIL,
			href,
			type,
		},
	]
}

export default addCover
