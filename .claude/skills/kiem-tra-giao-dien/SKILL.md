---
name: kiem-tra-giao-dien
description: Cách chụp màn hình và kiểm tra index.html bằng Chrome headless (độ rộng điện thoại, WebGL, hộp thoại, tràn ngang) – dùng sau mỗi lần sửa giao diện.
---

# Kiểm tra giao diện

Máy có Chrome tại `/Applications/Google Chrome.app` (không có Node hay Playwright). Chạy Chrome headless với `--screenshot` hoặc `--dump-dom`. Cửa sổ headless không hẹp được dưới 500px, nên để thử độ rộng điện thoại, hãy nhúng trang vào `<iframe style="width:375px">` trong một file HTML thử nghiệm đặt cùng thư mục và chạy với cờ `--allow-file-access-from-files`.

Khi kiểm tra:
- Chèn CSS `.js .reveal{opacity:1!important;transform:none!important}` để nội dung không bị ẩn giữa chừng hiệu ứng.
- Thêm cờ `--force-prefers-reduced-motion` khi chụp hộp thoại `#pd` hoặc `#qm`. Nếu không, ảnh chụp sẽ bắt đúng lúc hiệu ứng mở (FLIP) đang chạy dở.
- Kiểm tra tràn ngang bằng cách so sánh `documentElement.scrollWidth` với `clientWidth`.
- Module 3D (`type="module"` + importmap) không tải được qua `file://` khi trang nằm trong iframe. Muốn chụp ảnh bìa 3D, hãy phục vụ thư mục qua `python3 -m http.server` và mở bằng `http://127.0.0.1:<port>/`.
- Để Chrome headless vẽ được WebGL, thêm cờ `--use-angle=swiftshader --enable-unsafe-swiftshader`. Kèm theo `--force-prefers-reduced-motion` để ảnh bìa 3D chỉ vẽ một khung. Nếu không có cờ này, vòng lặp animation trên WebGL giả lập bằng CPU làm `--virtual-time-budget` chạy rất lâu.
