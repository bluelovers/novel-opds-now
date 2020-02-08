import searchIPAddress from 'address2';
import { generate as qrcode } from 'qrcode-terminal';
import terminalLink from 'terminal-link';
import console from 'debug-color2/logger';

export function showIP(port: string | number)
{
	console.info(`如果使用以下位址依然不能連上伺服器的話\n請利用網路搜尋如何查詢自己的電腦IP\n或利用 ${terminalLink(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)}\n這類工具來讓外部網路可以讀取自己內部網路的IP`);

	let ip: string = `localhost`;
	let href = `http://${ip}:${port}/opds`;
	console.success(terminalLink(ip, href));

	ip = searchIPAddress();

	if (ip != '127.0.0.1')
	{
		href = `http://${ip}:${port}/opds`;
		console.success(terminalLink(ip, href));
	}

	qrcode(href, { small: true });
}

export default showIP
