/**
 * Created by user on 2024/11/11.
 */
import { _getControllerFromSignal } from 'abort-controller-util';

export function _abortController(controller: any, signal?: any)
{
	try
	{
		controller?.abort();
	}
	catch (e)
	{

	}
	if (signal)
	{
		try
		{
			_getControllerFromSignal(signal)?.abort();
			signal.abort?.();
		}
		catch (e)
		{

		}
	}
}
