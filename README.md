# qr-cli

Denoで動作するQRコード生成・読み取りCLIツール。

## セットアップ

aliasを `.bashrc` や `.zshrc` に追加:

```bash
alias qr='deno run --allow-read --allow-write /path/to/qr/main.ts'
```

## 使い方

### エンコード（文字列 → QRコード）

```bash
# ターミナルにASCIIアートで表示
qr encode "Hello World"

# パイプで入力
echo "Hello World" | qr encode

# PNGファイルに保存
qr encode "Hello World" -o output.png
```

### デコード（QRコード → 文字列）

```bash
qr decode image.png
```

### ヘルプ

```bash
qr --help
```

## 依存関係

- Deno
- qrcode-generator (npm)
- jsqr (npm)
- pngjs (npm)
