#!/usr/bin/env node

import { checkIpfsInstall } from '../lib/task/check-ipfs-install';
import console from 'debug-color2/logger';

export default checkIpfsInstall()
	.then(path => console.success(`checkIpfsInstall`, path))
	.catch(err => {
		console.error(`checkIpfsInstall`, err)
		process.exit(1)
	})
;
