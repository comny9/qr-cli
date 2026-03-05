import { parseArgs } from "@std/cli/parse-args";
import { encode } from "./encode.ts";
import { decode } from "./decode.ts";

const HELP = `
QR Code CLI Tool

使用方法:
  qr encode <text> [-o <output.png>]   文字列をQRコードに変換
  qr decode <image.png>                QRコード画像を文字列に変換

エンコードオプション:
  -o, --output <file>   出力ファイル名（未指定時はターミナルに表示）

例:
  qr encode "Hello World"              # ターミナルにASCIIで表示
  qr encode "Hello World" -o qr.png    # ファイルに保存
  echo "Hello" | qr encode             # パイプで入力
  qr decode qr.png                     # QRコードを読み取り
`;

async function readStdin(): Promise<string | null> {
  if (Deno.stdin.isTerminal()) {
    return null;
  }
  
  const decoder = new TextDecoder();
  const chunks: Uint8Array[] = [];
  
  for await (const chunk of Deno.stdin.readable) {
    chunks.push(chunk);
  }
  
  if (chunks.length === 0) {
    return null;
  }
  
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return decoder.decode(result).trim();
}

async function main() {
  const args = parseArgs(Deno.args, {
    string: ["output", "o"],
    boolean: ["help", "h"],
    alias: {
      o: "output",
      h: "help",
    },
  });

  if (args.help || args.h) {
    console.log(HELP);
    Deno.exit(0);
  }

  const command = args._[0] as string | undefined;

  if (!command) {
    console.log(HELP);
    Deno.exit(1);
  }

  try {
    switch (command) {
      case "encode": {
        let text = args._[1] as string | undefined;
        
        if (!text) {
          const stdinText = await readStdin();
          if (stdinText) {
            text = stdinText;
          } else {
            console.error("エラー: エンコードする文字列を指定してください");
            Deno.exit(1);
          }
        }
        
        await encode(text, { output: args.output });
        break;
      }

      case "decode": {
        const imagePath = args._[1] as string | undefined;
        
        if (!imagePath) {
          console.error("エラー: QRコード画像のパスを指定してください");
          Deno.exit(1);
        }
        
        const result = await decode(imagePath);
        console.log(result);
        break;
      }

      default:
        console.error(`エラー: 不明なコマンド: ${command}`);
        console.log(HELP);
        Deno.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`エラー: ${error.message}`);
    } else {
      console.error("予期しないエラーが発生しました");
    }
    Deno.exit(1);
  }
}

main();
