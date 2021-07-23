import path from 'path';
import walk from './node-walk';

export default async function getImgPaths(folderPath: string) {
  const filterSet = new Set([
    '.apng',
    '.avif',
    '.gif',
    '.jpg',
    '.jpeg',
    '.jfif',
    '.pjpeg',
    '.pjp',
    '.png',
    '.svg',
    '.webp',
    '.bmp',
    '.ico',
    '.cur',
  ]);

  const imgPaths: Array<string> = [];

  for await (const p of walk(folderPath)) {
    const ext = path.extname(p);

    if (filterSet.has(ext)) {
      imgPaths.push(p);
    }
  }

  return imgPaths;
}
