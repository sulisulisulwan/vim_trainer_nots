const liveServer = require('live-server');
const params = {
	port: 3000,
	host: '0.0.0.0',
	root: __dirname + '/client/public',
	open: false,
	watchDotfiles: true,
	file: 'index.html',
	wait: 1000,
	logLevel: 2,

};

liveServer.start(params);

