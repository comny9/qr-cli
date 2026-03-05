import jsQR from "npm:jsqr@^1.4.0";
import { PNG } from "npm:pngjs@^7.0.0";
import * as jpeg from "npm:jpeg-js@^0.4.4";

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

function decodePng(fileData: Uint8Array): ImageData {
  const png = PNG.sync.read(Buffer.from(fileData));
  return {
    data: new Uint8ClampedArray(png.data),
    width: png.width,
    height: png.height,
  };
}

function decodeJpeg(fileData: Uint8Array): ImageData {
  const jpg = jpeg.decode(fileData, { useTArray: true });
  return {
    data: new Uint8ClampedArray(jpg.data),
    width: jpg.width,
    height: jpg.height,
  };
}

function detectFormat(fileData: Uint8Array): "png" | "jpeg" | "unknown" {
  if (fileData[0] === 0x89 && fileData[1] === 0x50 && fileData[2] === 0x4e && fileData[3] === 0x47) {
    return "png";
  }
  if (fileData[0] === 0xff && fileData[1] === 0xd8 && fileData[2] === 0xff) {
    return "jpeg";
  }
  return "unknown";
}

export async function decode(imagePath: string): Promise<string> {
  const fileData = await Deno.readFile(imagePath);
  const format = detectFormat(fileData);

  let imageData: ImageData;

  switch (format) {
    case "png":
      imageData = decodePng(fileData);
      break;
    case "jpeg":
      imageData = decodeJpeg(fileData);
      break;
    default:
      throw new Error("対応していない画像形式です（PNG, JPGのみ対応）");
  }

  const result = jsQR(imageData.data, imageData.width, imageData.height);

  if (!result) {
    throw new Error("QRコードを検出できませんでした");
  }

  return result.data;
}
