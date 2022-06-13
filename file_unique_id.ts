import { Buffer } from "https://deno.land/std@0.143.0/node/buffer.ts";
import { FileIdInfo, UniqueFileIdInfo } from "./file_id_info.ts";
import { FileId } from "./file_id.ts";
import { Util, decodeFileId, decodeUniqueFileId } from "./util.ts";

export class FileUniqueId {
  public type = 0;
  public id?: bigint;
  public volumeId?: bigint;
  public localId?: number | bigint;
  public url?: string;

  static fromFileId(fileId: string) {
    const result = decodeFileId(fileId);
    return FileUniqueId.buildFromDecode(result);
  }

  static buildFromDecode(decoded: FileIdInfo | UniqueFileIdInfo) {
    const inst = new FileUniqueId();
    inst.id = decoded.id;
    inst.volumeId = decoded.volumeId;
    inst.localId = decoded.localId;
    inst.url = decoded.url;
    inst.type = decoded.typeId;
    return inst;
  }

  static fromFileUniqueId(fileUniqueId: string) {
    const result = decodeUniqueFileId(fileUniqueId);
    return FileUniqueId.buildFromDecode(result);
  }

  static fromFileIdInstance(instance: FileId) {
    const inst = new FileUniqueId();
    inst.id = instance.id;
    inst.volumeId = instance.volumeId;
    inst.localId = instance.localId;
    inst.url = instance.url;
    inst.type = instance.typeId;
    return inst;
  }

  toFileUniqueId() {
    let out = Util.to32bitBuffer(this.type);
    if (this.type === Util.UNIQUE_WEB && this.url) {
      out += Util.packTLString(Buffer.from(this.url));
    } else if (
      this.type === Util.UNIQUE_PHOTO && this.volumeId && this.localId
    ) {
      out += Util.to64bitBuffer(this.volumeId);
      out += Util.to32bitSignedBuffer(this.localId as number);
    } else if (this.id) {
      out += Util.to64bitBuffer(this.id);
    }

    return Util.base64UrlEncode(Util.rleEncode(out));
  }
}

export default FileUniqueId;
