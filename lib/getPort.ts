/**
 * Created by user on 2020/2/2.
 */

export function getPortEnv(): string
{
	return process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT
}

export function getPort(port?: number | string): number
{
	return (port as any | 0) || 3000
}

export default getPort
