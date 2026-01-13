import router from '../../models/router.js';
import ui from '../../models/ui.js';
import { utils, hDate, hNumber } from '../../helper/index.js';

class PageAbout extends HTMLElement {
	constructor(){
		super();
	}

	createWrapper(){
		const self = this;
		const wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'justify-center', 'items-center', 'h-screen', 'flex-col');

		const text = document.createElement('div');
		text.classList.add('text-3xl');

		text.innerHTML = `
		<div class="hover-3d">
  		  <!-- content -->
  		  <figure class="max-w-100 rounded-2xl">
    		<img src="https://media1.tenor.com/m/2u4_kIM1h-YAAAAC/confeiteria-fina-bela-lucky.gif" alt="3D card" />
  		  </figure>
  		  <!-- 8 empty divs needed for the 3D effect -->
  		  <div></div>
  		  <div></div>
  		  <div></div>
  		  <div></div>
  		  <div></div>
  		  <div></div>
  		  <div></div>
  		  <div></div>
		</div>
		`;
		wrapper.append(text);

		const button = document.createElement('button');
		button.classList.add('btn', 'btn-wide', 'mt-5');
		button.innerText = 'Back ?';
		wrapper.append(button);

		button.addEventListener('click', () => {
			router.go('/home');
		})

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
    'page-about',
    PageAbout
)
