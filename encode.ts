import qrcode from "qrcode-generator";
import { PNG } from "pngjs";

export interface EncodeOptions {
  output?: string;
}

function generateQRModules(text: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  
  const moduleCount = qr.getModuleCount();
  const modules: boolean[][] = [];
  
  for (let row = 0; row < moduleCount; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < moduleCount; col++) {
      rowData.push(qr.isDark(row, col));
    }
    modules.push(rowData);
  }
  
  return modules;
}

export function encodeToAscii(text: string): string {
  const modules = generateQRModules(text);
  const moduleCount = modules.length;
  
  const lines: string[] = [];
  
  const topBorder = "█".repeat(moduleCount + 4);
  lines.push(topBorder);
  lines.push(topBorder);
  
  for (let row = 0; row < moduleCount; row += 2) {
    let line = "██";
    for (let col = 0; col < moduleCount; col++) {
      const top = modules[row][col];
      const bottom = row + 1 < moduleCount ? modules[row + 1][col] : false;
      
      if (top && bottom) {
        line += " ";
      } else if (top && !bottom) {
        line += "▄";
      } else if (!top && bottom) {
        line += "▀";
      } else {
        line += "█";
      }
    }
    line += "██";
    lines.push(line);
  }
  
  lines.push(topBorder);
  lines.push(topBorder);
  
  return lines.join("\n");
}

export async function encodeToPng(text: string, outputPath: string): Promise<void> {
  const modules = generateQRModules(text);
  const moduleCount = modules.length;
  
  const scale = 8;
  const margin = 4 * scale;
  const size = moduleCount * scale + margin * 2;
  
  const png = new PNG({ width: size, height: size });
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      
      const moduleX = Math.floor((x - margin) / scale);
      const moduleY = Math.floor((y - margin) / scale);
      
      let isDark = false;
      if (moduleX >= 0 && moduleX < moduleCount && moduleY >= 0 && moduleY < moduleCount) {
        isDark = modules[moduleY][moduleX];
      }
      
      const color = isDark ? 0 : 255;
      png.data[idx] = color;
      png.data[idx + 1] = color;
      png.data[idx + 2] = color;
      png.data[idx + 3] = 255;
    }
  }
  
  const buffer = PNG.sync.write(png);
  await Deno.writeFile(outputPath, buffer);
}

export async function encode(text: string, options: EncodeOptions): Promise<void> {
  if (options.output) {
    await encodeToPng(text, options.output);
    console.log(`QRコードを ${options.output} に保存しました`);
  } else {
    const ascii = encodeToAscii(text);
    console.log(ascii);
  }
}
