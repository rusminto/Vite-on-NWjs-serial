#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const dir = path.join(__dirname, "..");

fs.copyFileSync(
	path.join(dir, 'package.json'), 
	path.join(dir, 'dist', 'web', 'package.json')
);

fs.copyFileSync(
	path.join(dir, 'service.js'), 
	path.join(dir, 'dist', 'web', 'service.js')
);

fs.cpSync(
	path.join(dir, 'src_background'),
	path.join(dir, 'dist', 'web', 'src_background'), {
		recursive: true,
		force: true // Overwrites existing files
	}
)

import("nw-builder")
.then( async ({ default: nwbuild }) => {

	let contents = []
	try {
		const rawContents = String(fs.readFileSync(
			path.join(dir, 'package.json')
		));

		const parsedContents = JSON.parse(rawContents);
		contents = parsedContents.nwBuild;
	}catch(err){
		console.error(err)
	}

	for(const item of contents){
		await nwbuild(item);
	}
})
.catch((error) => {
    console.error(error);
});
