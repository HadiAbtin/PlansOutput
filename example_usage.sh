#!/bin/bash
# مثال استفاده از اسکریپت‌های تبدیل داده

echo "=== مثال استفاده از اسکریپت‌های تبدیل ==="
echo ""

# مثال 1: تبدیل داده JSON به Markdown
echo "1. تبدیل JSON به Markdown:"
echo "   python3 convert_data_to_markdown.py data.json plans/plan-X.md"
echo ""

# مثال 2: Fix کردن فایل موجود
echo "2. Fix کردن فایل موجود:"
echo "   python3 fix_newlines.py plans/plan-6.md"
echo ""

# مثال 3: Fix کردن چند فایل
echo "3. Fix کردن چند فایل:"
echo "   python3 fix_newlines.py plans/*.md"
echo ""

# مثال 4: بررسی فایل
echo "4. بررسی اینکه فایل مشکل دارد:"
echo "   grep -c '\\\\n' plans/plan-6.md"
echo "   wc -l plans/plan-6.md"
echo ""

echo "=== نکته ==="
echo "همیشه بعد از paste کردن داده، فایل را در GitHub Preview بررسی کنید!"
echo "اگر فایل به صورت یک خط طولانی نمایش داده می‌شود، از fix_newlines.py استفاده کنید."

