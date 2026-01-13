#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');

const dir = path.join(__dirname, "..");

const binDir = `${dir}/node_modules/.bin`;
const viteBin = `${binDir}/vite`;

const port = 8888;

execSync('node ./utils/listingComponent.js', {
	cwd: `${dir}`,
	stdio: 'inherit',
});
execSync('node ./utils/listingPageForRoute.js', {
	cwd: `${dir}`,
	stdio: 'inherit',
});
execSync('node ./utils/listingPluginHeaders.js', {
	cwd: `${dir}`,
	stdio: 'inherit',
});
//execSync('node ./utils/listingPluginComponent.mjs');
//execSync('node ./utils/listingPluginHeaders.mjs');
execSync(`${viteBin} --host --port ${port}`, {
	cwd: `${dir}`,
	stdio: 'inherit',
});
