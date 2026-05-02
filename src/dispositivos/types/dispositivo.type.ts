export type Dispositivo = {
    deviceId: string
    userId: string,
    activo: boolean,
    lastSyncAt: Date | null,
    metadata: DeviceMetadata | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}

export type DeviceMetadata = {
    name: string,
    platform: string,
    version: number,
}
