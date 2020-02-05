/**
 * Created by user on 2020/2/2.
 */

import Gun from 'gun';
import fetch from 'cross-fetch';
import Bluebird from 'bluebird';

let id = String(2784);

console.log(`wait a long time`);
fetch(`http://localhost:3000/file/dmzj/${id}`)
	.finally(async () => {

		console.log(`ok again, wait 3s`);
		await Bluebird.delay(3000);

		// @ts-ignore
		let gun = new Gun({
			peers: [
				//"http://localhost:3000/gun",
				"https://gunjs.herokuapp.com/gun",
				"http://nmr.io:8765/gun",
				"https://my-test-gun-server.herokuapp.com/gun",
			]
		});

		console.log(`ok again, wait 3s`);
		await Bluebird.delay(3000);

		await gun.get('epub-file')
			.get('wenku8')
			.get(id)

			.then(v => console.log(`here should return { timestamp, base64 }, but`, v))
		;
	})
;


