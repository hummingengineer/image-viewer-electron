import fs from 'fs';
import path from 'path';

// ES6 version using asynchronous iterators, compatible with node v10.0+
export default async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry: string = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

// Callback-based version for old versions of Node
export function walkWithCallback(
  dir: string,
  callback: (filepath: string, stats: fs.Stats) => void
) {
  fs.readdir(dir, function (err: NodeJS.ErrnoException, files: Array<string>) {
    if (err) throw err;
    files.forEach(function (file: string) {
      var filepath: string = path.join(dir, file);
      fs.stat(filepath, function (err: NodeJS.ErrnoException, stats: fs.Stats) {
        if (stats.isDirectory()) {
          walkWithCallback(filepath, callback);
        } else if (stats.isFile()) {
          callback(filepath, stats);
        }
      });
    });
  });
}

// ES6 version using Promise.all
export async function walkWithPromiseAll(dir: string) {
  let files = await fs.promises.readdir(dir);
  files = await Promise.all(
    files.map(async (file: string): Promise<any> => {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) return walkWithPromiseAll(filePath);
      else if (stats.isFile()) return filePath;
    })
  );

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}
