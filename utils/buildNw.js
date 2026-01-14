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

console.log("Copying node_modules...");
fs.cpSync(
    path.join(dir, 'node_modules'),
    path.join(dir, 'dist', 'web', 'node_modules'), {
        recursive: true,
        force: true
    }
);

const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

console.log("Rebuilding native modules for NW.js...");
if(isWin){
	const serialPortBindingPath = path.join(dir, 'dist', 'web', 'node_modules', '@serialport', 'bindings-cpp');
	if (fs.existsSync(serialPortBindingPath)) {
    	console.log("Rebuilding @serialport/bindings-cpp...");
    	try {
        	let pythonPath = 'python';
        	try {
            	pythonPath = execSync('python -c "import sys; print(sys.executable)"', { encoding: 'utf8' }).trim();
            	console.log(`Found python at: ${pythonPath}`);
        	} catch(e) {
            	console.warn("Could not detect python path automatically, using default 'python'");
        	}

        	// Use node-gyp's modern gyp to replace nw-gyp's ancient one
        	const sourceGyp = path.join(dir, 'node_modules', 'node-gyp', 'gyp');
        	const destGyp = path.join(dir, 'dist', 'web', 'node_modules', 'nw-gyp', 'gyp');
        	if (fs.existsSync(sourceGyp) && fs.existsSync(path.dirname(destGyp))) {
            	console.log("Replacing nw-gyp's bundled gyp with node-gyp's modern gyp...");
            	// rmSync might throw if file doesn't exist, check exists or use try-catch
            	try {
                	if(fs.existsSync(destGyp)) fs.rmSync(destGyp, { recursive: true, force: true });
                	fs.cpSync(sourceGyp, destGyp, { recursive: true });
            	} catch(e) {
                	console.warn("Failed to replace gyp folder:", e);
            	}
        	}

        	// PATCH nw-gyp to support Python 3
        	const nwGypConfigPath = path.join(dir, 'dist', 'web', 'node_modules', 'nw-gyp', 'lib', 'configure.js');
        	if (fs.existsSync(nwGypConfigPath)) {
            	console.log("Patching nw-gyp to support Python 3...");
            	let configContent = fs.readFileSync(nwGypConfigPath, 'utf8');
            	configContent = configContent.replace("semver.Range('>=2.5.0 <3.0.0')", "semver.Range('>=2.5.0 <4.0.0')");
            	fs.writeFileSync(nwGypConfigPath, configContent);
        	}

        	const nwGypVSPath = path.join(dir, 'dist', 'web', 'node_modules', 'nw-gyp', 'lib', 'find-visualstudio.js');
        	if (fs.existsSync(nwGypVSPath)) {
            	console.log("Patching nw-gyp to support newer Visual Studio...");
            	let vsContent = fs.readFileSync(nwGypVSPath, 'utf8');
            	vsContent = vsContent.replace(
                	"const match = /^(\\d+)\\.(\\d+)\\..*/.exec(info.version)", 
                	"if (!info.version) info.version = '17.0.0.0'; const match = /^(\\d+)\\.(\\d+)\\..*/.exec(info.version)"
            	);
            	vsContent = vsContent.replace(
                	"if (ret.versionMajor === 17) {", 
                	"if (ret.versionMajor === 17 || ret.versionMajor === 18) {"
            	);
            	fs.writeFileSync(nwGypVSPath, vsContent);
        	}

        	// Rebuild specifically for NW.js 0.104.0
        	let rebuildCmd = `npx nw-gyp rebuild --target=0.104.0 --arch=x64 --python="${pythonPath}"  --msvs_version=2022`;

        	execSync(rebuildCmd, { 
            	cwd: serialPortBindingPath,
            	stdio: 'inherit' 
        	});
    	} catch (e) {
        	console.error("Rebuild failed. Make sure Python and Visual Studio C++ Build Tools are installed.");
        	process.exit(1);
    	}
	}
}

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
		if(item.platform == "win" && isWin){
			await nwbuild(item);
		}else if(item.platform == "linux" && isLinux){
			await nwbuild(item);
		}
	}
})
.catch((error) => {
    console.error(error);
});
