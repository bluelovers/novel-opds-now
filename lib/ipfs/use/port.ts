import findFreePortSync from 'find-free-port-sync-fixed';
import { options } from 'yargs';
import createDefaultAddresses, { getDefaultAddressesPorts, IPort } from 'ipfs-defaults/addresses';
import { createServer, ListenOptions } from 'net';
import { execSync } from 'child_process';
import { IIPFSControllerDaemon } from '../types';

const usedPort = new Set<number>(getUsedPorts());
const blacklistPort = new Set<number>([
	4001,
	4002,
	5001,
	5002,
	8080,
	9090,
	3000,
]);

export async function getPort2(options: {
	port: number
})
{
	let port: number = await isAvailablePort(options.port).catch(e => null);

	if (!port)
	{
//		port = findFreePortSync({
//			start: options.port,
//		});

		port = options.port
	}

	let start = port;

	while (!port || usedPort.has(port))
	{
		start += 100;
		port = await isAvailablePort(start).catch(e => null);
//		port = findFreePortSync({
//			start,
//		})

		if (blacklistPort.has(port))
		{
			port = null;
		}
	}

	usedPort.add(port);

	return port
}

export async function findFreeAddresses(options: IIPFSControllerDaemon["opts"])
{
	getUsedPorts().forEach(port => usedPort.add(port));

	let ports = getDefaultAddressesPorts({}, options.type);

	let Swarm2: number = 0;

	ports.Swarm = await getPort2({ port: ports.Swarm as number + Swarm2 });

	//ports.Swarm2 = await getPort2({ port: ports.Swarm2 as number + Swarm2 });

	ports.API = await getPort2({ port: ports.API as number + Swarm2 });
	ports.Gateway = await getPort2({ port: ports.Gateway as number + Swarm2 });

	return {
		...createDefaultAddresses(ports, options.type),
		Swarm: [
			`/ip4/0.0.0.0/tcp/${ports.Swarm}`,
			`/ip6/::/tcp/${ports.Swarm}`,
			`/ip4/0.0.0.0/udp/${ports.Swarm}/quic`,
			`/ip6/::/udp/${ports.Swarm}/quic`,
		],
	}
}

export function isAvailablePort(options: ListenOptions | number)
{
	return new Promise<number>((resolve, reject) =>
	{
		const server = createServer();
		server.unref();
		server.on('error', reject);
		server.listen(options, () =>
		{
			// @ts-ignore
			const { port } = server.address();
			server.close(() =>
			{
				resolve(port);
			});
		});
	});
}

export function getUsedPorts(): number[]
{
	let options = {
		// port start for scan
		start: 1,
		// port end for scan
		end: 65534,
		// ports number for scan
		num: 1,
		// specify ip for scan
		ip: '0.0.0.0|127.0.0.1',
		// for inner usage, some platforms like darkwin shows commom address 0.0.0.0:10000 as *.10000
		_ipSpecial: '\\*|127.0.0.1',
		// scan this port
		port: null
	}

	let stepIndex = 0,
		maxStep = 65536,
		freePort = null,
		res = '',
		portSplitStr = ':',
		reg = new RegExp(`\\s(${options.ip}):(\\d+)\\s`, 'g'),
		regSpecial = new RegExp(`\\s(${options._ipSpecial})\\.(\\d+)\\s`, 'g');

		// get network state list
		res = execSync('netstat -an', {
			encoding: 'utf-8'
		});

		let usedPorts = res.match(reg);

		// special address usage for  ip.port
		if (!usedPorts)
		{
			usedPorts = res.match(regSpecial);
			portSplitStr = '.';
		}

		return !usedPorts ? [] : usedPorts.map(item =>
		{
			let port = item.split(portSplitStr);
			// @ts-ignore
			port = port.slice(-1)[0];
			// @ts-ignore
			return parseInt(port.slice(0, -1), 10);
		});
}
