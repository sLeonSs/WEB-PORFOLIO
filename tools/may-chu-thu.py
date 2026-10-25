"""Máy chủ thử cho trang Lắc Đầu: giống `python3 -m http.server` nhưng luôn bắt trình duyệt tải bản mới
(Cache-Control: no-store), để sửa xong tải lại là thấy ngay, không bị hiện bản cũ.
Dùng: python3 tools/may-chu-thu.py [cổng] [địa chỉ]   (mặc định 5500 127.0.0.1; 0.0.0.0 = cho điện thoại cùng Wi-Fi vào)"""
import http.server, os, sys

class KhongLuu(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
bind = sys.argv[2] if len(sys.argv) > 2 else '127.0.0.1'
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
http.server.ThreadingHTTPServer.allow_reuse_address = True
srv = http.server.ThreadingHTTPServer((bind, port), KhongLuu)
print('Serving HTTP on %s port %d (http://localhost:%d/index.html) ...' % (bind, port, port), flush=True)
srv.serve_forever()
