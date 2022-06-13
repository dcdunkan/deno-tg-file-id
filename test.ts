import { assertStrictEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";

import {
  decodeFileId,
  decodeUniqueFileId,
  FileId,
  FileUniqueId,
} from "./mod.ts";
import { Buffer } from "https://deno.land/std@0.143.0/node/buffer.ts";

Deno.test("File IDs", async (t) => {
  await t.step("sample id", () => {
    const fileId =
      "AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E";
    const file = decodeFileId(fileId);
    assertStrictEquals(file.fileType, "voice");
  });

  await t.step("some more file ids", async (t) => {
    const fileIds: Record<string, string> = {
      sticker:
        "CAACAgEAAxkBAAEE3SRgO-OW-HDMHW5rOGsSFWhZScQl4AAC8BIAApa4VwXGFC4AAaCSsQMeBA",
      voice:
        "AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E",
      photo:
        "AgACAgQAAxkBAAEE3SJgO-GfzTTuFpKFCl4JYBFqpugg6gAC6bYxGzqI4FEpgFjCLHbVHA-lgCddAAMBAAMCAAN4AAM2rwUAAR4E",
      audio:
        "CQACAgQAAxkBAAEE3Y9gPBq7mDBuFlr6rq7wsS1PcGGeiwACqQkAAjp72FGISW9QI52Nfx4E",
    };

    for (const key in fileIds) {
      await t.step(`should return fileType '${key}'`, () => {
        const output = decodeFileId(fileIds[key]);
        assertStrictEquals(key, output.fileType);
      });

      await t.step("should return same fileId", () => {
        const fId = FileId.fromFileId(fileIds[key]);
        assertStrictEquals(fileIds[key], fId.toFileId());
      });

      await t.step("should return same id for FileUniqueId and FileId", () => {
        const fId = FileId.fromFileId(fileIds[key]);
        const fU = FileUniqueId.fromFileId(fileIds[key]);
        assertStrictEquals(fId.id, fU.id);
      });
    }
  });

  await t.step("profile file ids", async (t) => {
    const profileFileIds: Record<string, string> = {
      small: "AQADBAADwawxGxMjtgcACDvytxsABAIAAxMjtgcABPqM9f80seQ8I7wHAAEeBA",
      big: "AQADBAADwawxGxMjtgcACDvytxsABAMAAxMjtgcABPqM9f80seQ8JbwHAAEeBA",
    };
    for (const key in profileFileIds) {
      await t.step("should be profile_photo and " + key, function () {
        const output = decodeFileId(profileFileIds[key]);
        assertStrictEquals(output.fileType, "profile_photo");
        assertStrictEquals(output.photoSize, key);
      });
    }
  });

  await t.step("sticker thumb", async (t) => {
    await t.step("should be thumbnail and stickerSetId", () => {
      const output = decodeFileId(
        "AAQEABPWoT0jXQADBAADDwADyPrsE2HR5gsnLl4rPkYAAh4E",
      );
      assertStrictEquals(output.fileType, "thumbnail");
      assertStrictEquals(output.stickerSetId, 1435798118124748815n);
    });
  });
});

Deno.test("File unique IDs", async (t) => {
  await t.step("sample unique id", () => {
    const fileUniqueId = "AgADuwgAAj0d4FE";
    const file = decodeUniqueFileId(fileUniqueId);
    assertStrictEquals(file.type, "document");
  });

  await t.step("some more unique ids", async (t) => {
    const fileUniqueIds: Record<
      string,
      Record<string, string | number | bigint>
    > = {
      document: {
        fid: "AgADqQkAAjp72FE",
        typeId: 2,
        id: 5897599201079986601n,
      },
      photo: {
        typeId: 1,
        fid: "AQADD6WAJ10AAzavBQAB",
        volumeId: 400094700815n,
      },
    };

    for (const type in fileUniqueIds) {
      await t.step(type, async (t) => {
        await t.step("should be " + type, function () {
          const out = decodeUniqueFileId(fileUniqueIds[type].fid as string);
          if (type === "photo") {
            assertStrictEquals(out.volumeId, fileUniqueIds[type].volumeId);
          } else if (type === "document") {
            assertStrictEquals(out.id, fileUniqueIds[type].id);
          }
          assertStrictEquals(out.typeId, fileUniqueIds[type].typeId);
          assertStrictEquals(type, out.type);
        });
      });
    }
  });
});

Deno.test("Other", async (t) => {
  await t.step("convert from mtproto to bot api", () => {
    const value = {
      "flags": 1,
      "document": {
        "flags": 1,
        "id": "1592756632805186045",
        "accessHash": "8648091647552727112",
        "fileReference": {
          "type": "Buffer",
          "data": [
            1,
            0,
            0,
            2,
            99,
            98,
            38,
            9,
            232,
            192,
            109,
            199,
            16,
            52,
            153,
            28,
            112,
            196,
            62,
            180,
            121,
            40,
            55,
            243,
            225,
          ],
        },
        "date": 1565305305,
        "mimeType": "image/webp",
        "size": 15974,
        "thumbs": [{
          "type": "j",
          "bytes": {
            "type": "Buffer",
            "data": [
              25,
              6,
              179,
              2,
              225,
              89,
              6,
              229,
              0,
              89,
              6,
              128,
              89,
              6,
              225,
              25,
              6,
              153,
              6,
              239,
              25,
              6,
              153,
              6,
              225,
              89,
              6,
            ],
          },
        }, { "type": "m", "w": 320, "h": 320, "size": 9340 }],
        "videoThumbs": null,
        "dcId": 5,
        "attributes": [{ "w": 512, "h": 512 }, {
          "flags": 0,
          "mask": false,
          "alt": "💨",
          "stickerset": {
            "id": "1592756632805179695",
            "accessHash": "7107174106550882933",
          },
          "maskCoords": null,
        }, { "fileName": "sticker.webp" }],
      },
      "ttlSeconds": null,
    };
    const fileId = new FileId();
    fileId.typeId = 8;
    fileId.id = BigInt(value.document.id);
    fileId.accessHash = BigInt(value.document.accessHash);
    fileId.fileReference = Buffer.from(
      Uint8Array.from(Object.values(value.document.fileReference.data)),
    ).toString("hex");

    assertStrictEquals(
      fileId.fileReference,
      "0100000263622609e8c06dc71034991c70c43eb4792837f3e1",
    );

    fileId.fileType = "sticker";
    fileId.version = 4;
    fileId.subVersion = 30;
    fileId.dcId = 5;

    const file_id = fileId.toFileId();
    assertStrictEquals(
      file_id,
      "CAACAgUAAxkBAAICY2ImCejAbccQNJkccMQ-tHkoN_PhAAL9GQACuJsaFkgoZ62IMQR4HgQ",
    );
  });

  await t.step("sticker owner id", async (t) => {
    const fileIdStr =
      "CAACAgIAAxkBAAIEVF9Do80olppb0490gLH2I1cszuoMAALcCQACAoujAAEqUB3Wl6aD6BsE";
    const fileId = FileId.fromFileId(fileIdStr);
    const owner = fileId.getOwnerId();
    await t.step("should be 10717954", function () {
      assertStrictEquals(owner, 10717954);
    });
  });
});
