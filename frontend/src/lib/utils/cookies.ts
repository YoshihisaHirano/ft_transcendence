const isDocument = typeof document !== 'undefined';

export function saveCookie(name: string, value: string, days?: number) {
	if (isDocument) {
		let expires = '';
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + (value || '') + expires + '; path=/';
	}
}

export function getCookie(key: string) {
	if (isDocument) {
		let nameEQ = key + '=';
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	return null;
}

export function removeCookie(key: string) {
	if (isDocument) {
		saveCookie(key, '', 0);
	}
}
