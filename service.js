// ================== GLOBAL VAR ====================
global.__basedir = `${__dirname}/src_background`;
global.__classdir = `${__basedir}/class`;
global.__libdir = `${__basedir}/lib`;
global.__configFile = `${__basedir}/config/app.config`;

// ================== EXPRESS ====================
const config = require(__configFile);
const c$express = require('express.helper');
const debug = config.debug;

const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const port = isDev ? 3000 : 8888; 

const preRouteMiddleware = null;

const postRouteMiddleware = (app, express) => {
	if (!isDev) {
    	app.use(express.static(__dirname));
    	app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
	}
}

(async () => {
	try {
		await c$express.startup(port, `${__basedir}/routes`, debug, config.cookie, preRouteMiddleware, postRouteMiddleware);
	} catch (e) {
		console.error("Error in c$express.startup:", e);
	}
})();
