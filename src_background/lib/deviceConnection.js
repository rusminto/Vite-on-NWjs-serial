const serialHelper = require('serial.helper');

const DEVICE_CONFIG = {
	sensor: {
		baud: 9600
	},
	arduino: {
		baud: 9600
	}
}

class deviceConnection {

	connectedDevices = {}
	availablePaths = {}

	async getSerialList(){
		const self = this;

		const list = await serialHelper.list();

		const result = {};

		for(const item of list){
			if(item.vendorId && item.productId){
				result[item.path] = `[${item.vendorId}:${item.productId}] ${item.path}`
			}
		}

		self.availablePaths = result;

		return {
			status: true,
			data: result
		}
	}

	async connect(options){
		const self = this;

		const { device, path } = options;

		// check if device already connected previously, then disconnect it
		if(self.connectedDevices[device]){
			self.connectedDevices[device].disconnect();
		}

		if(path != "-" || !path){
			// if not, then try to connect 
			self.connectedDevices[device] = new serialHelper({
				port: path,
				...DEVICE_CONFIG[device],
			})

			self.connectedDevices[device].on('data', (received) => {
				self.sendEvent({
					device,
					message: received.data
				})
			})
		}

		return {
			status: true
		}
	}

	eventClient = {};
	counter = 0;
	listenEvent(req, res){
		const self = this;

		res.setHeader('Content-Type', 'text/event-stream');
    	res.setHeader('Cache-Control', 'no-cache');
    	res.setHeader('Connection', 'keep-alive');

		self.counter++;
    	self.eventClient[self.counter] = res;

    	req.on('close', () => {
        	res.end();
        	delete self.eventClient[self.counter];
    	});
	}

	sendEvent(message){
		const self = this;

		const msg = `data: ${JSON.stringify(message)}\n\n`

		for(const client in self.eventClient){
			self.eventClient[client].write(msg);
		}
	}
}

module.exports = new deviceConnection();
