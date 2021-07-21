import Bluebird from 'bluebird';

export const globalWaiting = new Map<any, Promise<any>>();

export function newWaitingPromise<T>(waitingKey: any, fn: (() => Promise<T>))
{
	return resolveWaiting<T>(waitingKey)
		.then(() => {
			let p = fn();
			globalWaiting.set(waitingKey, p);

			return p
				.finally(() => globalWaiting.delete(waitingKey))
		})
	;
}

export function resolveWaiting<T>(waitingKey: any)
{

	return Bluebird.resolve()
		.then<T>(() => {
			let p = globalWaiting.get(waitingKey) as Bluebird<any>
			if (p ?? false)
			{
				console.debug(`[GlobalWaiting]`, `wait`, waitingKey, p.isPending?.() ?? p)

				return Bluebird.resolve(p)
					.finally(() => {
						console.debug(`[GlobalWaiting]`, `done`, waitingKey, p.isPending?.() ?? p)
					})
			}
		})
}
