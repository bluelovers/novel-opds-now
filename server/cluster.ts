/**
 * Created by user on 2020/2/2.
 */

import cluster from 'cluster';
import { startServer } from '../';

if (cluster.isMaster)
{
	cluster.fork() && cluster.on('exit', () => {
		console.log(`cluster.fork`);
		cluster.fork();
	});
}
else
{
	startServer();
}
