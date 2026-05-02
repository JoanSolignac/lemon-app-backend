export type DeviceMetadataDto = {
  name: string;
  platform: string;
  version: number;
};

export type DispositivoDto = {
  deviceId: string;
  userId: string;
  activo: boolean;
  lastSyncAt: Date | null;
  metadata: DeviceMetadataDto | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};