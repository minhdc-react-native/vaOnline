#!/bin/bash
set -e

# Dùng llvm-readelf (macOS qua brew install llvm)
READELF="/opt/homebrew/opt/llvm/bin/llvm-readelf"

if [ ! -x "$READELF" ]; then
  echo "❌ Không tìm thấy llvm-readelf tại $READELF"
  echo "👉 Hãy cài bằng: brew install llvm"
  exit 1
fi

APK_OR_AAB="$1"

if [ -z "$APK_OR_AAB" ]; then
  echo "⚠️  Cách dùng: $0 <file.apk | file.aab>"
  exit 1
fi

TMP_DIR="apk_extract_tmp"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

echo "📦 Đang giải nén $APK_OR_AAB ..."
unzip -qo "$APK_OR_AAB" -d "$TMP_DIR"

echo "🔍 Đang kiểm tra các file .so ..."
find "$TMP_DIR" -name "*.so" | while read sofile; do
    pagesize_hex=$($READELF -l "$sofile" | grep "LOAD" | awk '{print $NF}' | head -n 1)
    pagesize_dec=$((pagesize_hex))
    
    # Chỉ in nếu KHÁC 16384 (0x4000)
    if [ "$pagesize_dec" -ne 16384 ]; then
        echo "⚠️  $(basename "$sofile"): Page size = $pagesize_hex ($pagesize_dec)"
    fi
done

echo "✅ Hoàn tất kiểm tra."


# run: ./check-pagesize.sh app/build/outputs/bundle/release/app-release.aab