import { Stream } from 'stream';
import Bluebird from 'bluebird';

export function streamToPromise<T>(stream: Stream)
{
	return new Bluebird<T>(function (resolve, reject)
	{
		stream.on("end", resolve);
		stream.on("error", reject);
	})
}
