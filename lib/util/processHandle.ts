import console from 'debug-color2/logger';

process.on('unhandledRejection', (reason, promise) =>
{
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
