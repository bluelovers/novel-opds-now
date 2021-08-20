/**
 * Created by user on 2020/2/2.
 */

import cluster from 'cluster';
import { startServer } from '../index';

/**
 * idea 無法停止 sub process 所以取消 cluster
 */
if (0 && cluster.isMaster)
{
	cluster.fork() && cluster.on('exit', () => {
		console.log(`cluster.fork`);
		cluster.fork();
	});
}
else
{
	startServer({
		port: 3000,
	});
}
