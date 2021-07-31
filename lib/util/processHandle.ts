import console from 'debug-color2/logger';

process.on('unhandledRejection', (reason, promise) =>
{
	console.red.debug('Unhandled Rejection at:', promise, 'reason:', reason);
});
