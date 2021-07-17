
export function siteNeverExpired(siteID: string | string[])
{
	return [siteID].flat().includes('masiro')
}
