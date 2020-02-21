import { array_unique_overwrite } from 'array-hyper-unique';

/**
 * Created by user on 2020/2/21.
 */

export function handleArgvList(siteID: string | string[], novelID: string | string[])
{
	if (!Array.isArray(siteID))
	{
		siteID = [siteID];
	}
	if (!Array.isArray(novelID))
	{
		novelID = [novelID];
	}

	siteID = array_unique_overwrite(siteID.map(v => String(v)));
	novelID = array_unique_overwrite(novelID.map(v => String(v)));

	return {
		siteID,
		novelID,
	}
}
