import Bluebird from 'bluebird';

export function retryGunNode<T>(gunNode, maxRetryAttempts = 5)
{
	maxRetryAttempts = Math.max(maxRetryAttempts | 0, 0);
	let retryAttempts = 0;
	return new Bluebird<T>((resolve, reject) => {
		function f()
		{
			(gunNode as any)
				.once(function (a)
				{
					for (let k in a)
					{
						if (
							k === '_'
							//|| k === '#'
						) continue;
						return resolve(a);
					}

					if (retryAttempts >= maxRetryAttempts)
					{
						//console.log(`give up retry, ${retryAttempts}`);
						return resolve(a)
					}

					//console.log(`retry again, ${++retryAttempts}`);
					setTimeout(f, 1000);
				})
			;
		}

		f();
	})
}

export default retryGunNode
