export function getProxy(proxy?: string)
{
	return proxy || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || undefined;
}

export default getProxy
