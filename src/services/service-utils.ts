export function createUuid() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
        const random = Math.floor(Math.random() * 16);
        const value = character === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}

export function withCreateMetadata<T extends { id?: string; created_at?: string; updated_at?: string }>(payload: T): T {
    const now = new Date().toISOString();

    return {
        ...payload,
        id: payload.id || createUuid(),
        created_at: payload.created_at || now,
        updated_at: payload.updated_at || now,
    };
}
