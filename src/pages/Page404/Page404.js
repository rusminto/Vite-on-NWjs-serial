export default window.customElements.define(
    'page-404',
    class extends HTMLElement {
        constructor(){
            super();
		}

		createWraper(){
			const body = document.createElement('div');
			body.classList.add('light');
			
			const wrapper = document.createElement('div');
			wrapper.classList.add('wrapper', 'vh-100');
			body.append(wrapper);

			const wrapper2 = document.createElement('div');
			wrapper2.classList.add('align-items-center', 'h-100', 'd-flex', 'w-50', 'mx-auto');
			wrapper.append(wrapper2);

			const wrapper3 = document.createElement('div');
			wrapper3.classList.add('mx-auto', 'text-center');
			wrapper2.append(wrapper3);

			const title = document.createElement('h1');
			title.classList.add('display-1', 'm-0', 'font-weight-bolder', 'text-muted', 'title-404');
			title.innerText = '404';
			wrapper3.append(title);
			
			const title1 = document.createElement('h1');
			title1.classList.add('mb-1', 'text-muted', 'font-weight-bold');
			title1.innerText = 'OOPS!';
			wrapper3.append(title1);

			const desc = document.createElement('h6');
			desc.classList.add('mb-3', 'text-muted');
			desc.innerText = 'Halaman tidak ditemukan.';
			wrapper3.append(desc);

			const aLink = document.createElement('a');
			aLink.classList.add('btn', 'btn-lg', 'px-5');
			aLink.innerText = 'Kembali ke halaman login';
			aLink.setAttribute('href', '/login');
			wrapper3.append(aLink);

			return body;
		}

        connectedCallback(){
            const self = this;

            self.classList.add('page-404');

			window.onload = () => {
				self.classList.add('show');
			}

            self.append(self.createWraper());

        }

        disconnectedCallback(){
            const self = this;
        }
	}
)
