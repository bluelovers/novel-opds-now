/**
 * Created by user on 2020/2/2.
 */

import Gun from 'gun';
//import 'gun/lib/then';
import fetch from 'cross-fetch';
import Bluebird from 'bluebird';
import { EnumIDKEYListString } from 'novel-downloader/src/all/const';

let id = String(2682);
let IDKEY: EnumIDKEYListString = 'wenku8';

// @ts-ignore
//console.LOG = false;
//Gun.log.LOG = false;

console.log(`wait a long time`);
Bluebird.resolve()
	.thenReturn(fetch(`http://localhost:3000/file/${IDKEY}/${id}`))
	.catch(e => null)
	.finally(async () => {

		console.log(`ok again, wait 3s`);
		await Bluebird.delay(3000);

		// @ts-ignore
		let gun = new Gun({
			peers: [
				//"http://localhost:3000/gun",
				//"https://gunjs.herokuapp.com/gun",
				"http://nmr.io:8765/gun",
				"https://my-test-gun-server.herokuapp.com/gun",
			]
		});

		console.log(`ok again, wait 3s`);
		await Bluebird.delay(3000);

		console.log(222)

		await gun
			.get('epub-file')
			.get(IDKEY)
			//.get(id)
			//.get('filename')
			.then(raw => {

				try
				{
					delete raw.base64;
				}
				catch (e)
				{

				}

				console.log(7777)
				console.dir(raw)

			})

		;

		console.log(111)

//		await gun.get('epub-file')
//			.get(IDKEY)
//			.get(id)
//			.get('filename')
//
//			.then(v => console.log(`here should return { timestamp, base64 }, but`, v))
//		;




	})
	//.catch(e => null)
;


