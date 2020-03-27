/**
 * Created by user on 2020/3/27.
 */
import Signals = NodeJS.Signals;

const map = new WeakMap<(...argv) => any, (...argv) => any>();

export function processListener(eventName: Signals, fn: (...argv) => any)
{
	let cb = map.get(fn);

	if (!cb)
	{
		cb = (...argv) =>
		{
			return fn()
		}

		map.set(fn, cb)
	}

	process.removeListener(eventName, cb);
	process.once(eventName, cb);

	return {
		eventName,
		cb,
		fn,
	}
}

export function processExit(stop: (...argv) => any)
{
	processListener('SIGINT', stop);
	processListener('SIGTERM', stop);
	processListener('exit' as any, stop);
}

export default processExit
