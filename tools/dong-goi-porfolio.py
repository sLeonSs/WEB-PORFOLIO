"""Gộp index.html + css/ + js/ + images/ thành một file PORFOLIO.html duy nhất, lưu vào ~/Documents/WEB - PORFOLIO (Tài liệu).
Có thể truyền đường dẫn khác: python3 tools/dong-goi-porfolio.py "<đường dẫn>/PORFOLIO.html".
Ảnh dùng 1 lần -> nhúng base64 tại chỗ. Ảnh dùng nhiều lần -> nhúng 1 lần trong window.LD_IMG,
các chỗ dùng ghi "ldimg:<số>" và được JS gắn lại khi tải trang (kể cả trong <template>)."""
import base64, collections, json, os, re, sys
s = open('index.html', encoding='utf-8').read()
css = open('css/style.css', encoding='utf-8').read()
js = lambda p: open(p, encoding='utf-8').read().replace('</script', '<\\/script')
MIME = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}
rx = re.compile(r'(?<=["\'(])images/[^"\')\s]+')   # chỉ ảnh tương đối, không đụng URL https://lacdau.com/images/... của SEO
uri = lambda p: f'data:{MIME[os.path.splitext(p)[1].lower()]};base64,' + base64.b64encode(open(p, 'rb').read()).decode()
count = collections.Counter(rx.findall(s) + rx.findall(css))
shared = {p: str(i) for i, p in enumerate(sorted(p for p, n in count.items() if n > 1))}
css = rx.sub(lambda m: uri(m.group(0)), css)   # CSS: luôn nhúng tại chỗ
s = rx.sub(lambda m: 'ldimg:' + shared[m.group(0)] if m.group(0) in shared else uri(m.group(0)), s)
resolver = ('<script>\nwindow.LD_IMG = ' + json.dumps({k: uri(p) for p, k in shared.items()}) + ';\n'
  '/* gắn ảnh dùng chung vào mọi thuộc tính "ldimg:<số>", kể cả trong <template> */\n'
  '(function fix(root) {\n'
  '  [].forEach.call(root.querySelectorAll("*"), function (el) {\n'
  '    [].forEach.call(el.attributes, function (a) { if (a.value.indexOf("ldimg:") === 0) a.value = window.LD_IMG[a.value.slice(6)]; });\n'
  '    if (el.tagName === "TEMPLATE") fix(el.content);\n'
  '  });\n'
  '})(document);\n</script>\n')
V = r'(?:\?v=[\w.-]+)?'   # mã phiên bản ?v=… chống bộ nhớ đệm (có thể có hoặc không)
for a, b in [(r'<link rel="stylesheet" href="css/style\.css' + V + '">', '<style>\n' + css + '\n</style>'),
             (r'<script src="js/main\.js' + V + '"></script>', resolver + '<script>\n' + js('js/main.js') + '\n</script>'),
             (r'<script src="js/hero3d-textures\.js' + V + '"></script>', '<script>\n' + js('js/hero3d-textures.js') + '\n</script>'),
             (r'<script src="js/hero3d\.js' + V + '"></script>', '<script>\n' + js('js/hero3d.js') + '\n</script>')]:
    assert len(re.findall(a, s)) == 1, a
    s = re.sub(a, lambda m: b, s)
left = re.findall(r'(?<=["\'(])(?:images|css|js)/[^"\')\s]+', s)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Documents/WEB - PORFOLIO/PORFOLIO.html')
open(OUT, 'w', encoding='utf-8').write(s)
print('ảnh', len(count), '| dùng chung', len(shared), '| còn tham chiếu ngoài', left, '|', round(os.path.getsize(OUT) / 1048576, 2), 'MB ->', OUT)
