export type FileIdInfo = {
  version: number;
  subVersion: number;
  typeId: number;
  dcId: number;
  hasReference: boolean;
  hasWebLocation: boolean;
  fileType: string | number;
  fileReference: string;
  url?: string;
  access_hash: bigint;
  id: bigint;
  volumeId?: bigint;
  secret?: bigint | number;
  photoSizeSource?: number;
  thumbnailType?: string;
  photoSize?: "small" | "big";
  dialogId?: number | bigint;
  dialogAccessHash?: number | bigint;
  stickerSetId?: number | bigint;
  stickerSetAccessHash?: number | bigint;
  localId?: number;
  thumbTypeId?: number;
};

export type UniqueFileIdInfo = {
  type: string;
  typeId: number;
  url?: string;
  volumeId?: bigint;
  localId?: number;
  id?: bigint;
};
