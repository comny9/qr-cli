# qr-cli

Denoで動作するQRコード生成・読み取りCLIツール。

## インストール

### 方法1: URLから直接実行

クローン不要で、aliasを設定するだけで使えます。`.bashrc` や `.zshrc` に追加:

```bash
alias qr='deno run --allow-read --allow-write https://raw.githubusercontent.com/comny9/qr-cli/main/main.ts'
```

### 方法2: deno install でインストール

グローバルコマンドとしてインストール:

```bash
deno install --allow-read --allow-write -n qr https://raw.githubusercontent.com/comny9/qr-cli/main/main.ts
```

`~/.deno/bin` にPATHが通っていれば、`qr` コマンドが使えるようになります。

### キャッシュのクリア

リモートURLから実行する場合、Denoは依存関係をローカルにキャッシュします。最新版に更新するには:

```bash
deno cache --reload https://raw.githubusercontent.com/comny9/qr-cli/main/main.ts
```

`deno install` でインストールした場合は、再インストール:

```bash
deno install -f --allow-read --allow-write -n qr https://raw.githubusercontent.com/comny9/qr-cli/main/main.ts
```

### 方法3: ローカルにクローン

```bash
git clone https://github.com/comny9/qr-cli.git
cd qr-cli
```

aliasを `.bashrc` や `.zshrc` に追加:

```bash
alias qr='deno run --allow-read --allow-write /path/to/qr-cli/main.ts'
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
