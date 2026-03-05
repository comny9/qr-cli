import jsQR from "jsqr";
import { PNG } from "pngjs";

export async function decode(imagePath: string): Promise<string> {
  const fileData = await Deno.readFile(imagePath);
  
  const png = PNG.sync.read(Buffer.from(fileData));
  const { data, width, height } = png;
  
  const imageData = new Uint8ClampedArray(data);
  
  const result = jsQR(imageData, width, height);
  
  if (!result) {
    throw new Error("QRコードを検出できませんでした");
  }
  
  return result.data;
}
