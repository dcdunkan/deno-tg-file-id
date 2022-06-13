import { Buffer } from "https://deno.land/std@0.143.0/node/buffer.ts";
import { FileUniqueId } from "./file_unique_id.ts";
import { decodeFileId, Util } from "./util.ts";

export class FileId {
  public version = 0;
  public subVersion = 0;
  public dcId = 0;
  public typeId = 0;
  public fileType: string | number = "";
  public fileReference?: string;
  public url?: string;
  public id = BigInt(0);
  public accessHash = BigInt(0);
  public volumeId?: bigint = BigInt(0);
  public localId?: number | bigint = 0;
  public photoSizeSource?:
    | "legacy"
    | "thumbnail"
    | "dialogPhoto"
    | "stickerSetThumbnail";
  public photoSizeSourceId?: number;
  public secret?: bigint | number;
  public dialogId?: number | bigint;
  public dialogAccessHash?: number | bigint;
  public isSmallDialogPhoto?: boolean;

  public stickerSetId?: number | bigint;
  public stickerSetAccessHash?: number | bigint;

  public thumbType?: string;
  public thumbTypeId?: number;

  constructor() {
  }

  static fromFileId(fileId: string) {
    try {
      const decoded = decodeFileId(fileId);
      const inst = new FileId();
      inst.version = decoded.version;
      inst.subVersion = decoded.subVersion;
      inst.dcId = decoded.dcId;
      inst.typeId = decoded.typeId;
      inst.fileType = decoded.fileType;
      if (decoded.hasReference) {
        inst.fileReference = decoded.fileReference;
      }
      if (decoded.hasWebLocation) {
        inst.url = decoded.url;
        return inst;
      }
      inst.id = decoded.id;
      inst.accessHash = decoded.access_hash;
      if (decoded.typeId <= 2) {
        inst.volumeId = decoded.volumeId;
        inst.localId = decoded.localId;
        inst.photoSizeSourceId = decoded.photoSizeSource;
        switch (inst.photoSizeSourceId) {
          case Util.PHOTOSIZE_SOURCE_LEGACY:
            inst.secret = decoded.secret;
            inst.photoSizeSource = "legacy";
            break;
          case Util.PHOTOSIZE_SOURCE_THUMBNAIL:
            inst.thumbType = decoded.thumbnailType;
            inst.photoSizeSource = "thumbnail";
            inst.thumbTypeId = decoded.thumbTypeId;
            break;
          case Util.PHOTOSIZE_SOURCE_DIALOGPHOTO_SMALL:
          case Util.PHOTOSIZE_SOURCE_DIALOGPHOTO_BIG:
            inst.photoSizeSource = "dialogPhoto";
            inst.dialogId = decoded.dialogId;
            inst.dialogAccessHash = decoded.dialogAccessHash;
            inst.isSmallDialogPhoto = decoded.photoSizeSource ===
              Util.PHOTOSIZE_SOURCE_DIALOGPHOTO_SMALL;
            break;

          case Util.PHOTOSIZE_SOURCE_STICKERSET_THUMBNAIL:
            inst.photoSizeSource = "stickerSetThumbnail";
            inst.stickerSetId = decoded.stickerSetId;
            inst.stickerSetAccessHash = decoded.stickerSetAccessHash;
            break;
        }
      }
      return inst;
    } catch (e) {
      console.log(e);
      throw new Error("Invalid fileId");
    }
  }

  toFileId(): string {
    let type = this.typeId;
    if (this.fileReference) {
      type |= Util.FLAGS.FILE_REFERENCE_FLAG;
    }
    if (this.url) {
      type |= Util.FLAGS.WEB_LOCATION_FLAG;
    }
    let out = "";

    out += Util.to32bitBuffer(type);
    out += Util.to32bitBuffer(this.dcId);
    if (this.fileReference) {
      const tlString = Util.packTLString(
        Buffer.from(this.fileReference, "hex"),
      );

      out += tlString.toString("binary");
    }
    if (this.url) {
      const tlString = Util.packTLString(
        new Buffer(new TextEncoder().encode(this.url)),
      );
      out += tlString.toString("binary");
      if (this.accessHash) {
        out += Util.to64bitBuffer(this.accessHash);
      }
      return Util.base64UrlEncode(Util.rleEncode(out));
    }

    out += Util.to64bitBuffer(this.id);
    out += Util.to64bitBuffer(this.accessHash);

    if (this.typeId <= 2 && this.volumeId && this.photoSizeSourceId) {
      out += Util.to64bitBuffer(this.volumeId);
      if (this.version >= 4) {
        out += Util.to32bitBuffer(this.photoSizeSourceId);
      }
      switch (this.photoSizeSource) {
        case "legacy":
          out += Util.to64bitBuffer(this.secret as bigint);
          break;
        case "thumbnail":
          out += Util.to32bitBuffer(this.thumbTypeId!);
          out += this.thumbType?.padEnd(4, "\0");
          break;
        case "dialogPhoto":
          out += Util.to64bitBuffer(this.dialogId as bigint);
          out += Util.to64bitBuffer(this.dialogAccessHash as bigint);
          break;
        case "stickerSetThumbnail":
          out += Util.to64bitBuffer(this.stickerSetId as bigint);
          out += Util.to64bitBuffer(this.stickerSetAccessHash as bigint);
          break;
      }
      out += Util.to32bitSignedBuffer(this.localId as number);
    }
    if (this.version >= 4) {
      out += String.fromCharCode(this.subVersion);
    }
    out += String.fromCharCode(this.version);
    return Util.base64UrlEncode(Util.rleEncode(out));
  }

  toFileUniqueId() {
    return FileUniqueId.fromFileIdInstance(this).toFileUniqueId();
  }

  getOwnerId() {
    if (
      this.typeId === Util.TYPES.indexOf("sticker") &&
      (this.version === 4 || this.version === 2)
    ) {
      const tmp = Buffer.alloc(8);
      tmp.writeBigInt64LE(this.id & BigInt("72057589742960640"));
      return tmp.readUInt32LE(4);
    }
    return 0;
  }
}

export default FileId;
// php
// 030000020400000019010004dd26603be3db1e55adc51b7970f5af5e51915875ccdc0000bb0800003d1de0517f8effa2ffeee2411e04
//node
// 030000020400000019010004dd26603be3db1e55adc51b7970f5af5e51915875ccdc0000bb0800003d1de05100000000000000001e04
