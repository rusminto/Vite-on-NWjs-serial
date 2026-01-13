import ui from '../../models/ui.js';

class ELEMENT extends HTMLElement {
    constructor(){
        super();
	}

	devices = {
		sensor: {
			name: "Sensor",
			path: null,
			isConnected: false
		},
		arduino: {
			name: "Arduino",
			path: null,
			isConnected: false
		}
	}

	availablePaths = {
		"-": "-"
	}

	createDevicePane(id, name){
		const self = this;

		const wrapper = document.createElement('div');
		wrapper.classList.add('pt-5');

		const title = document.createElement('div');
		title.classList.add('font-bold');
		title.innerText = `Path ${name}`;
		wrapper.append(title);

		const pane = document.createElement('div');
		pane.classList.add('flex', 'gap-3');
		wrapper.append(pane);

		const select = document.createElement('select');
		select.classList.add('select');
		pane.append(select);
		
		for(const path in self.availablePaths){
			const option = document.createElement('option');
			option.innerText = self.availablePaths[path];
			option.value = path;
			select.append(option);
		}

		const btnConnect = document.createElement('button');
		btnConnect.classList.add('btn');
		btnConnect.innerText = "Hubungkan";
		pane.append(btnConnect);

		const indicator = document.createElement('div');
		indicator.id = `indicator-${id}`;
		pane.append(indicator);

		btnConnect.addEventListener('click', async () => {
			self.connectDevice(id, select.value);
		})

		return wrapper;
	}

	createWrapper(){
		const self = this;

		const wrapper = document.createElement('div');
		wrapper.classList.add('card', 'bg-base-100', 'shadow-sm', 'w-200', 'p-5');

		const title = document.createElement('div')
		title.classList.add('font-title', 'text-2xl', 'md:text-2xl', 'lg:text-2xl', 'font-bold');
		title.innerText = "Koneksi Perangkat";
		wrapper.append(title);

		const btnRefresh = document.createElement('button');
		btnRefresh.classList.add('btn', 'w-50');
		btnRefresh.innerText = "Muat ulang";
		wrapper.append(btnRefresh);

		btnRefresh.addEventListener('click', () => {
			self.getListDevice();
		})

		for(const device in self.devices){
			const name = self.devices[device].name;
			wrapper.append(self.createDevicePane(device, name));
		}

		return wrapper;
	}

	async getListDevice(){
		const self = this;

		await fetch('/api/connection/list/serial')
			.then(res => res.json())
			.then(body => {
				self.availablePaths = Object.assign({
					"-": "-"
				}, body.data)

				const selects = self.querySelectorAll('.select');

				for(const select of selects){
					select.innerHTML = "";

					for(const path in self.availablePaths){
						const pathValue = self.availablePaths[path];
						if(select.value == pathValue) continue;

						const option = document.createElement('option');
						option.innerText = self.availablePaths[path];
						option.value = path;
						select.append(option);
					}
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	async connectDevice(device, path){
		const self = this;

		await fetch('/api/connection/connect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				device: device,
				path: path
			})
		})
			.then(res => res.json())
			.then(body => {
				const indicator = self.querySelector(`#indicator-${device}`);
				if(indicator){
					indicator.innerHTML = "";
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	listenMessage(){
		const self = this;

		const eventSource = new EventSource('/api/connection/events');

		eventSource.onmessage = (event) => {
			const parsedData = JSON.parse(event.data);

			const indicator = self.querySelector(`#indicator-${parsedData.device}`);
			if(indicator){
				indicator.innerText = parsedData.message;
			}
		}

		eventSource.onerror = (err) => {
			console.error("EventSource failed:", err);
            eventSource.close(); // Close connection if needed
		}
	}

	connectedCallback(){
        const self = this;

		self.append(self.createWrapper());

		self.getListDevice();
		self.listenMessage();

		self._listeners = {
			'screen-resize': () => {
			}
		}

		for(let key in self._listeners){
			ui.addEventListener(key, self._listeners[key]);
		}
    }

    disconnectedCallback(){
        const self = this;

		for(let key in self._listeners){
			ui.removeEventListener(key, self._listeners[key]);
		}
    }
}

export default window.customElements.define(
    'pane-device-connection', ELEMENT
)
