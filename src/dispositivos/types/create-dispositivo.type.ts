export type CreateDispositivo = {
    deviceId: string,
    userId: string,
    metadata: {
        name: string,
        platform: string,
        version: number,
    },
}