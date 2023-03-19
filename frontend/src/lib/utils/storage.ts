const haveStorage = typeof localStorage !== 'undefined';

export function saveToStorage(key: string, value: string) {
    if (haveStorage) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error(e);
        }
    }
}

export function getFromStorage(key: string) {
    if (haveStorage) {
        return localStorage.getItem(key);
    }
    return null;
}

export function removeFromStorage(key: string) {
    if (haveStorage) {
        localStorage.removeItem(key);
    }
}