> Deno port of [smaznet/tg-file-id](https://github.com/smaznet/tg-file-id)

# tg-file-id

[![deno module](https://shield.deno.dev/x/tg_file_id)](https://deno.land/x/tg_file_id)

A simple [Deno](https://deno.land) module to decode file_id and file_unique_id
of Bot API updates to get more information of Telegram files.

Ported from https://github.com/smaznet/tg-file-id (Node.js)

You can find the Deno module here: https://deno.land/x/tg_file_id

## Examples

### file_id

```ts
import { decodeFileId } from "https://deno.land/x/tg_file_id/mod.ts";

const result = decodeFileId(
  "AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E",
);

console.log(result);
```

Output:

```ts
{
  version: 4,
  subVersion: 30,
  typeId: 3,
  dcId: 4,
  hasReference: true,
  hasWebLocation: false,
  fileType: 'voice',
  fileReference: '010004dd26603be3db1e55adc51b7970f5af5e51915875ccdc',
  id: 5899747659685562555n,
  access_hash: 4747619738920652415n
}
```

### file_unique_id

```ts
import { decodeUniqueFileId } from "https://deno.land/x/tg_file_id/mod.ts";

const result = decodeUniqueFileId("AgADuwgAAj0d4FE");

console.log(result);
```

Output:

```ts
{
  typeId: 2,
  type: "document",
  id: 5899747659685562555n
};
```

### Convert file_id to file_unique_id

```ts
import { FileId } from "https://deno.land/x/tg_file_id/mod.ts";

const uniqueFileId = FileId.fromFileId(
  "AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E",
).toFileUniqueId();

console.log(uniqueFileId); // => AwADuwgAAj0d4FE
```

Credits to the [original developer](https://github.com/smaznet).

See the [original repository](https://github.com/smaznet/tg-file-id) for more
information.
