export const baseUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5176/api/';
export const unauthorizedCode = "401";

export function addAuthHeader(authToken: string) {
    return {
        Authorization: `Bearer ${authToken}`
    }
}

export function addContentType() {
    return {
        ['Content-Type']: 'application/json'
    }
}

export function removeApiEndpoint(path: string) {
    return path.replace('/api', '');

}

export function createBackendUrl(endpoint: string) {
    return new URL(endpoint, import.meta.env.VITE_BACKEND_URL);
}
