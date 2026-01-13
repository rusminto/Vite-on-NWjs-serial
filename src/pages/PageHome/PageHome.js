import router from '../../models/router.js';
import ui from '../../models/ui.js';
import { utils, hDate, hNumber } from '../../helper/index.js';

class PageHome extends HTMLElement {
	constructor(){
		super();
	}

	createWrapper(){
		const self = this;
		const wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'justify-center', 'items-center', 'h-screen', 'flex-col', 'bg-gray-200');
		
		const paneDeviceConnection = document.createElement('pane-device-connection');
		wrapper.append(paneDeviceConnection);

		return wrapper;
	}

	checkNotif(){
		const flag = ui.getFlag();
		if(flag?.notification){
			new Notify(flag.notification);
		}
	}

	connectedCallback(){
		const self = this;

		window.onload = async () => {
			self.classList.add('show');
			ui.triggerUpdateScreen();
			await utils.sleep(300);	// to make sure that screen was ready

			self.checkNotif();
		}

		const wrapper = self.createWrapper();

		self.append(wrapper);

		self._listeners = {
			'screen-resize': ({ detail }) => {
			},
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
    'page-home',
    PageHome
)
