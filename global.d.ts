declare module "find-free-port-sync-fixed"
{
	function findFreePortSync(options?: {
		start?: number,
		end?: number,
		num?: number,
		ip?: string,
		port?: number,
	}): number;

	export = findFreePortSync
}
