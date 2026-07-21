export const API_BASE_URL = 'http://localhost:8080'

export function getAuthHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
    }
}

export async function readErrorMessage(response, fallbackMessage) {
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        try {
            const body = await response.json()

            return body.detail || body.message || fallbackMessage
        } catch {
            return fallbackMessage
        }
    }

    const text = await response.text()

    return text || fallbackMessage
}