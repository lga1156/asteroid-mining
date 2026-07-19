const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

type ApiErrorBody = {
    error?: string;
};

export class ApiError extends Error {
    public readonly status: number;

    public constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function apiRequest(path: string, init?: RequestInit): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: 'application/json',
            ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
            ...init?.headers,
        },
    });

    if (!response.ok) {
        let message = `Запрос завершился с ошибкой ${response.status}`;

        try {
            const body = (await response.json()) as ApiErrorBody;
            message = body.error || message;
        } catch {
            // The status code still gives the user a meaningful error when the body is not JSON.
        }

        throw new ApiError(message, response.status);
    }

    return response.json() as Promise<unknown>;
}
