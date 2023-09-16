export async function request<T>({ url, options = {}, responseType }: { url: string, options?: RequestInit, responseType?: 'text' | 'json' }): Promise<T> {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 5000);

    const res = await fetch(url, {
        ...options,
        signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok || res.status > 300) {
        throw new Error(`Error getting ${url}`);
    }

    return responseType === 'text'
        ? await res.text()
        : responseType === 'json'
            ? await res.json()
            : null;
}