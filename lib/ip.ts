import searchIPAddress from 'address2';
import qrcode from 'qrcode-terminal';
import terminalLink from 'terminal-link';
import _console from 'debug-color2/logger';
import console from 'debug-color2';
import { NetworkInterfaceInfo, networkInterfaces, hostname as os_hostname } from "os";
import { format as urlFormat } from 'url';

export function showIP(port: string | number)
{
	_console.info(`如果不能連上伺服器的話\n請查詢自己的電腦IP\n或確認自己的防火牆與 wifi 設定\n或利用 ${terminalLink(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)}\n這類工具來讓外部網路可以讀取自己內部網路的IP`);

	console.yellow.log(`\n請使用以下其中一個位址來連接至伺服器\n`);

	let ip: string = `localhost`;
	let href = urlFormat({
		protocol: 'http',
		hostname: ip,
		port,
		pathname: '/opds',
	});
	console.info(terminalLink(ip, href));

	ip = os_hostname();
	href = urlFormat({
		protocol: 'http',
		hostname: ip,
		port,
		pathname: '/opds',
	});
	console.info(terminalLink(ip, href));

	ip = searchIPAddress();
	let interfaceName = ip;

	let interfaces = networkInterfaces();
	Object.entries(interfaces)
		.forEach(([name, data]) =>
		{

			let _skip = false;

			data = data
				.filter(v =>
				{

					if (ip && v.address === ip)
					{
						interfaceName = name;
						_skip = true;
					}
					else if (v.address === '127.0.0.1' || v.address === '::1')
					{
						_skip = true;
					}

					return v.address && !_skip
				})
			;

			if (_skip)
			{
				return;
			}

			let ls = data
				.filter(v =>
				{
					return v.family === 'IPv4'
				})
			;

			(ls.length ? ls : data)
				.forEach(v =>
				{
					let ip = v.address;
					let href = urlFormat({
						protocol: 'http',
						hostname: ip,
						port,
						pathname: '/opds',
					});

					console.info(terminalLink(name, href));
				})
			;

			//console.log(interfaceName, data)

		})
	;

	if (ip != '127.0.0.1')
	{
		href = urlFormat({
			protocol: 'http',
			hostname: ip,
			port,
			pathname: '/opds',
		});
		console.log('');
		console.success(terminalLink(interfaceName, href));
	}
	else
	{
		ip = `localhost`;
		href = urlFormat({
			protocol: 'http',
			hostname: ip,
			port,
			pathname: '/opds',
		});
	}

	qrcode.generate(href, { small: true });
}

export default showIP
