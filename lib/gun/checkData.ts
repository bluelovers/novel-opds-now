/**
 * Created by user on 2020/2/5.
 */
import { IGunEpubNode, IGunEpubData } from '../types';

export function checkGunData(data: IGunEpubNode): data is Exclude<IGunEpubNode, {
	exists: false,
}>
{
	if (data && data.timestamp)
	{
		if (data.exists)
		{
			let { base64, filename, exists, timestamp, href } = data;

			if (href && filename && exists && timestamp)
			{
				return true;
			}

			if (!(base64 && filename && exists && timestamp))
			{
				return false;
			}

			return true;
		}
	}

	return null;
}

export default checkGunData
