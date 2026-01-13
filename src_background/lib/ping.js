class ping {
	counter = 0;

	getResponse(){
		const self = this;
		//process.stdout.write(`>>>>>>>>>>>>>> ${self.counter}`)

		return {
			status: true,
			message: `Up to you, lah ${self.counter++}`
		}
	}
}

module.exports = new ping();
