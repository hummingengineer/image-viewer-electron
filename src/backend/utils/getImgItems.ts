import fs from 'fs';
import path from 'path';
import { ImgItem } from '../../types';

export default async function getImgItems(imgPaths: Array<string>, page: number) {
  const start = (page - 1) * 10;
  const end = page * 10 - 1;

  const imgDatas: Array<ImgItem> = [];

  for (let i = start; i <= end; ++i) {
    if (!imgPaths[i]) break;

    imgDatas.push({
      path: imgPaths[i],
      base64: `data:image/${path.extname(imgPaths[i]).slice(1)};base64,${await fs.promises.readFile(
        imgPaths[i],
        { encoding: 'base64' }
      )}`,
    });
  }

  return imgDatas;
}
