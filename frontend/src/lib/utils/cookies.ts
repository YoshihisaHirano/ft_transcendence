const haveStorage = typeof localStorage !== 'undefined';

export function setCookie(key: string, value: string) {
    if (haveStorage) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error(e);
        }
    }
}

export function getCookie(key: string) {
    if (haveStorage) {
        return localStorage.getItem(key);
    }
    return null;
}

export function removeCookie(key: string) {
    if (haveStorage) {
        localStorage.removeItem(key);
    }
}