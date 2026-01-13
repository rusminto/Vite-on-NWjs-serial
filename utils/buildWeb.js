#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const dir = path.join(__dirname, "..");

const binDir = path.join(dir, `node_modules/.bin`);
const viteBin = path.join(binDir, 'vite');

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

execSync(viteBin + ' build', {
	cwd: `${dir}`,
	stdio: 'inherit',
});
