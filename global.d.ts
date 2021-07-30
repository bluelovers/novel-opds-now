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

declare module 'many-keys-weakmap'
{
	class ManyKeysWeakMap<K extends object, V> extends WeakMap<K, V> {}
	export = ManyKeysWeakMap
}

declare module 'many-keys-map'
{
	class ManyKeysMap<K, V> extends Map<K, V> {}
	export = ManyKeysMap
}
