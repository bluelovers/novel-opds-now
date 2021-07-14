import { array_unique_overwrite } from 'array-hyper-unique';

export function handleCachePeersArray(arr: string[])
{
	return array_unique_overwrite(arr.map(s => s.toString().replace(/^\s+|\s+$/g, '')).filter(Boolean))
}

export function handleCachePeersFile(buf: Buffer | string)
{
	return handleCachePeersArray(buf.toString().split(/\s+/g))
}
