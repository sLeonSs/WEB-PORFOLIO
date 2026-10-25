# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tổng quan

Đây là trang hồ sơ năng lực một trang (tiếng Việt) của LACDAU.COM / Công ty TNHH Magitech. Trang gồm HTML/CSS/JS thuần, đã được tách từ file đơn `lacdau-preview_2.html` cũ ra thành:
- `index.html`: nội dung trang.
- `css/style.css`: toàn bộ CSS. Đầu file có mục lục các khối.
- `js/main.js`: JS chính (menu, chi tiết sản phẩm, bảng báo giá, cửa sổ mini, logo Dock…).
- `js/hero3d.js` và `js/hero3d-textures.js`: ảnh bìa 3D.
- `images/<mục>/`: ảnh theo từng mục: `hero`, `khach-hang`, `san-pham`, `du-an`, `lien-he`, `logo`, `seo`.
 Dự án không có bước build, không dùng trình quản lý gói, không có test và không phải repo git, nên trước khi sửa lớn hãy tự sao lưu file.

## Quy trình làm việc với khách

**Sau mỗi 3 yêu cầu chỉnh sửa trang của khách, chạy một lượt tối ưu SEO.** Đếm theo các tin nhắn yêu cầu sửa trang (`index.html`, `css/`, `js/`, `images/`); câu hỏi và yêu cầu không sửa trang thì không tính. Đến lượt thứ 3, làm xong yêu cầu đó rồi rà SEO luôn trong cùng lượt trả lời, và báo khách là đã chạy. Một lượt rà SEO gồm:
- Đối chiếu `<title>`, meta description, Open Graph với nội dung vừa sửa.
- Kiểm tra JSON-LD khớp với trang: giá, sản phẩm, số điện thoại, địa chỉ, MST. Sau đó kiểm tra JSON-LD vẫn parse được.
- Đảm bảo ảnh mới thêm có `alt` mô tả bằng tiếng Việt, và thứ bậc heading không bị phá (một `<h1>`, các `<h2>` theo từng mục).
- Cập nhật `lastmod` trong `sitemap.xml` thành ngày hôm đó.
- Kiểm tra trang không lỗi JS và không tràn ngang.

## Git

- Repo: `https://github.com/sLeonSs/WEB-PORFOLIO`, nhánh `main`.
- **Không tự commit, không tự push.** Chỉ commit và push khi khách nói rõ là muốn đẩy lên.

## Ảnh và tốc độ tải

- Ảnh chụp trong `images/` là **WebP** (chất lượng 80, rộng tối đa 1400px). Riêng `images/seo/og-image.jpg` giữ JPG cho Facebook và Zalo; logo và mã QR giữ PNG.
- Ảnh mới thêm vào thì cũng chuyển sang WebP, đặt `width`/`height` theo kích thước thật, kèm `decoding="async"` và `loading="lazy"`. Riêng logo đầu trang không lazy và có `fetchpriority="high"`.
- 4 ảnh mặt 3D trong `js/hero3d-textures.js` là WebP dạng base64.

## SEO

- `<head>` gồm:
  - tiêu đề và mô tả chứa từ khóa chính (in lót chuột, keycaps, cốc theo yêu cầu, giá tận xưởng);
  - canonical `https://lacdau.com/`, thẻ robots, Open Graph và Twitter card đầy đủ;
  - favicon dạng SVG inline.
- `og:image` và `twitter:image` trỏ tới `https://lacdau.com/images/seo/og-image.jpg` (file `images/seo/og-image.jpg` cỡ 1200×630). Không được đổi lại thành data URI, vì Facebook và Zalo không đọc được dạng đó.
- JSON-LD (`application/ld+json` trong `<head>`) có `@graph` gồm 3 phần: `Organization`/`LocalBusiness` (địa chỉ, số Mr. Sơn, MST), `WebSite` và `ItemList` 5 sản phẩm. Giá trong `AggregateOffer` lấy từ bảng giá trên trang. Mỗi `Product` có `image` gồm các ảnh trong `<template>` của sản phẩm đó; thêm hoặc bớt ảnh sản phẩm thì sửa cả mảng này. Khi đổi giá, số điện thoại hoặc địa chỉ thì phải sửa cả ở JSON-LD.
- Hai file `robots.txt` và `sitemap.xml` giả định cả thư mục được đưa lên gốc tên miền `https://lacdau.com/`. Nếu đưa lên đường dẫn khác thì phải sửa canonical, `og:url`, các URL ảnh và sitemap.
- Khi sửa `lastmod` trong `sitemap.xml`, ghi ngày của lần cập nhật nội dung.

## File gộp PORFOLIO.html

`PORFOLIO.html` là bản gộp toàn bộ trang vào **một file duy nhất** để gửi hoặc mở ở bất kỳ đâu. File được lưu ở thư mục **`~/Documents/WEB - PORFOLIO/PORFOLIO.html`** (Tài liệu → "WEB - PORFOLIO", có dấu cách quanh dấu gạch), không nằm trong dự án. Script nhận cả `?v=…` sau đường dẫn CSS/JS, và có thể truyền đường dẫn lưu khác làm tham số:
- CSS và JS được nhúng thẳng vào file, ảnh được nhúng dạng base64.
- Ảnh dùng ở nhiều chỗ chỉ nhúng một lần trong `window.LD_IMG`; các chỗ dùng ghi `ldimg:<số>` và được JS gắn lại khi tải trang, kể cả trong `<template>`.
- Three.js và font Google vẫn tải từ CDN, nên cần có mạng.

File này là **bản lưu của khách, không được động vào**: không tự chạy lại script, không ghi đè, không sửa, không di chuyển. Mọi chỉnh sửa trang chỉ làm trên mã nguồn trong VS Code (`index.html`, `css/`, `js/`, `images/`). Chỉ chạy `python3 tools/dong-goi-porfolio.py` khi khách yêu cầu rõ là tạo lại hoặc cập nhật file PORFOLIO.

## Chạy trang

- Mở trực tiếp: `open index.html`.
- Trong VS Code nhấn F5: `.vscode/launch.json` có 4 cấu hình:
  - "Mở index.html": mở thẳng file bằng Chrome.
  - "Xem giả lập điện thoại": mở `tools/xem-dien-thoai.html`. Trang này hiện `index.html` trong các khung iPhone 14/15 (390×844), iPhone SE (375×667), Android (360×780) và iPad dọc (820×1180, bật bằng ô tích). Nút "Tải lại tất cả" tải bản mới nhất, vì iframe có `?t=` theo thời gian.
  - "Mở qua máy chủ thử (gửi form được)": cổng 5500, chỉ máy này truy cập được.
  - "Xem trên điện thoại (cùng Wi-Fi)": cổng 5501, mở cho cả mạng. Trên điện thoại vào `http://<IP máy Mac>:5501/index.html`.
- Hai cấu hình máy chủ chạy `tools/may-chu-thu.py`. Script này giống `http.server` nhưng gửi `Cache-Control: no-store`, vì máy chủ mặc định làm trình duyệt hiện lại bản cũ (khách từng gặp lỗi "không được update").
- Mở bằng `file://` vẫn chạy đủ cả 3D, vì hai lý do:
  - `js/hero3d.js` là script thường, nạp Three.js bằng `import()` động qua importmap trong `index.html`. Script `type="module"` có `src` thì bị Chrome chặn trên `file://`.
  - 4 ảnh mặt 3D giữ dạng base64 trong `js/hero3d-textures.js`. Ảnh `file://` không dùng làm texture WebGL được, vì bị coi là khác nguồn.

  Đừng đổi hai chỗ này về module hoặc file ảnh.

## Cấu trúc trang

`css/style.css` và `js/main.js` được nạp kèm mã phiên bản `?v=…` để trình duyệt không dùng bản cũ trong bộ nhớ đệm. Sau mỗi lần sửa CSS/JS, đổi mã này (ví dụ theo ngày).

Cuối `index.html` nạp lần lượt: `js/main.js` → importmap → `js/hero3d-textures.js` → `js/hero3d.js`. Đường dẫn ảnh trong HTML là tương đối (`images/...`).

Các mục có anchor id lần lượt là `#gioi-thieu` (01), `#san-pham` (02), `#quy-trinh` (03), `#du-an` (04), `#dang-ky` (form đăng ký nhận báo giá) và `#lien-he`.

**Tiêu đề các mục được đồng bộ** theo đầu trang và mục 01. CSS nằm ở khối "ĐỒNG BỘ TIÊU ĐỀ, CHỮ VÀ MÀU" ở cuối `css/style.css`. Không còn ô số `.sec-num`; tiêu đề mỗi mục gồm:
- `<header class="sec-head sec-head2">`.
- Bên trái là `.ab-title`, gồm kicker "0x  Tên mục" và `<h2>` đậm vừa (600), màu `--g-900`. Kicker cỡ 1rem, đậm 700 (0.9rem trên điện thoại). Số mục nằm trong ô xanh đặc `.ab-no` (chỉ ghi số, không có dấu "/"). CSS ở khối "TIÊU ĐỀ MỤC DỄ NHÌN HƠN"; khách từng chê chữ kicker cũ (0.72rem) quá nhỏ.
- Bên phải là `.sec-sub`, nếu mục đó có câu mô tả.

**Màu xanh toàn trang theo đầu trang:** khối "ĐỒNG BỘ MÀU XANH THEO ĐẦU TRANG" ở cuối `css/style.css` đặt lại `--g`, `--g-600`, `--g-700` = **#0a7c52** (màu nút "Liên hệ báo giá") và `--g-50`/`--g-100` thành tông nhạt cùng họ. Xanh ngọc sáng #12b277 cũ không còn dùng:
- Các `rgba(18,178,119,…)` đã đổi thành `rgba(10,124,82,…)`.
- 6 `.step-card` dùng `--c:#0a7c52`.
- `theme-color` và favicon cũng là #0a7c52.
- Muốn đổi màu xanh cả trang thì chỉ sửa khối này.

Các quy ước chung đi kèm:
- Tiêu đề thẻ trong các mục đậm 700, không dùng 800.
- **Giao diện mềm mại** (khối "GIAO DIỆN MỀM MẠI" ở cuối `css/style.css`, thay cho quy ước góc vuông 4px cũ mà khách thấy "hơi cứng"). Thang bo góc: nút dạng viên thuốc 999px; ô số và biểu tượng 10–14px; thẻ và nút tab 16–18px; khung lớn (`.ab-box`, `.step-card`) 24px. Viền nhạt `--soft-line`, bóng đổ mềm `--soft-sh` / `--soft-sh-hover`, thẻ nhấc lên nhẹ khi rê chuột. Thêm phần tử mới thì theo thang này, đừng dùng lại góc 2–4px.
- Màu xanh trong mục 01 dùng cùng bộ với các mục khác: `--g` cho nút đang chọn và ô nhấn, `--g-50` cho khung nhạt.
- Mục liên hệ dùng kicker chữ nhỏ thay cho viên thuốc.

**CSS được viết thêm dần thành nhiều lớp.** Các khối viết sau cố ý ghi đè khối trước: menu căn giữa không logo (nay bị khối "MENU KIỂU LOGITECH" ở cuối file ghi đè), ảnh bìa vừa một màn hình, bố cục sản phẩm so le, dòng thời gian dạng sóng và khối "TỐI ƯU MỌI KÍCH THƯỚC MÀN HÌNH" ở cuối. Trước khi sửa một quy tắc, hãy grep selector đó vì nó có thể bị định nghĩa lại ở phía dưới. Phần ghi đè mới thì thêm vào cuối `css/style.css`. Comment trong code viết bằng tiếng Việt, giữ nguyên phong cách này.

Các mốc breakpoint là 1100 / 980 / 860 / 640 / 440 / 360px:
- Từ 860px trở xuống, menu chuyển sang nút hamburger.
- Từ 980px trở xuống, dòng thời gian chuyển sang dạng dọc.
- Từ 640px trở xuống, bảng giá chuyển sang dạng thẻ.
- `(hover:none)` tắt các hiệu ứng rê chuột trên thiết bị cảm ứng.

**Nội dung sản phẩm nằm trong `<template class="pc-detail">` của từng `article.pc`** (id `sp-lot-chuot`, `sp-keycaps`, `sp-coc`, `sp-kinh`, `sp-phu-kien`). Hàm JS `openDetail()` sao chép template vào hộp thoại `#pd`:
- Ảnh trong `.d-imgs img` trở thành các khung ảnh. Nếu chỉ có một ảnh dọc (thuộc tính height lớn hơn width) thì khung chi tiết nhận class `.pd-portrait`. Nếu có nhiều ảnh thì nhận `.pd-multi`.
- `.d-body` trở thành cột nội dung bên phải.
- **Điện thoại + iPad (≤1180px): vuốt sang trái hoặc phải để đóng khung chi tiết** (đoạn JS ngay sau `pdX` trong `js/main.js`). Khung chạy theo ngón tay; vuốt đủ xa (90px) hoặc vuốt nhanh thì trượt hẳn ra ngoài rồi gọi `closeDetail(null, true)`, tham số `swiped` để không bay về thẻ sản phẩm. Cú bấm đi kèm sau khi vuốt bị bỏ qua.
  - Kéo dọc trên dải ảnh tự cuộn vẫn là tua ảnh. Kéo ngang thì đoạn tua ảnh nhường lại cho thao tác vuốt.
  - Từ 1181px trở lên không có thao tác vuốt.
- Khối liên hệ `#qm .qm-contact` được sao chép vào cuối mọi khung chi tiết sản phẩm. Vì vậy sửa thông tin liên hệ trong `#qm` sẽ cập nhật ở mọi nơi.

**Ảnh keycaps (`#sp-keycaps`):**
- Ảnh bìa thẻ là ảnh "Keycap Việt Nam" **nguyên khung, không cắt** (600×600). CSS `#sp-keycaps .pc-img{aspect-ratio:1/1}` để khung thẻ vừa đúng ảnh. Nếu đổi sang ảnh có tỉ lệ khác thì sửa `aspect-ratio` theo ảnh.
- Khung chi tiết có 5 ảnh: Keycap Việt Nam, One Piece (ảnh cầm tay), Hatsune Miku, One Piece White Orange V1, bộ cam đen. Ba ảnh vuông 600px giữ nguyên cỡ gốc; hai ảnh cầm tay rộng 1000px.
- `.d-imgs` của keycaps có thuộc tính `data-auto`. Khi mở khung chi tiết, JS nhân đôi dải ảnh và thêm class `.pd-panel.pd-auto`, rồi `autoLoop()` dịch `.pd-frames` lên đều với tốc độ `AUTO_SPEED = 150` px/giây, cuộn vòng liền mạch.
  - Bấm (hoặc chạm, Enter/Space) vào cột ảnh một lần thì dải tạm dừng và hiện nhãn "Đã tạm dừng · bấm để chạy tiếp" (class `.pd-paused`); bấm lần nữa thì chạy tiếp. Bấm ảnh keycaps không còn thu nhỏ khung chi tiết; đóng bằng nút × hoặc Esc.
  - Giữ chuột (hoặc ngón tay) kéo lên/xuống để tua dải ảnh (class `.pd-dragging` khi đang kéo). Kéo quá 6px mới tính là kéo, dưới mức đó tính là bấm. Lăn chuột cũng tua được.
  - Ảnh trong khung chi tiết được đặt `loading="eager"` khi mở khung để tải ngay.
  - Khi bật `prefers-reduced-motion`, dải ảnh không tự chạy mà cuộn tay như các sản phẩm khác.
  - Muốn sản phẩm khác cũng tự cuộn thì thêm `data-auto` vào `.d-imgs` của sản phẩm đó.
- Ảnh nhỏ của keycaps ở menu thả xuống và trong `#qm` là ảnh cắt 160×160 từ ảnh Keycap Việt Nam.

**Ảnh cốc (`#sp-coc`):** khung chi tiết có 4 ảnh và cũng có `data-auto` (tự cuộn, bấm để dừng, kéo để tua như keycaps):
- `coc-in.webp` (1024×1024, ảnh bìa thẻ).
- `coc-h86-gaming.webp` (1000×1000).
- `coc-nova-esports.webp` (1000×1500).
- `coc-ka-cyber-game.webp` (1000×1500, cắt 2:3 quanh chiếc cốc từ ảnh gốc 1180×2560).

**Ảnh lót chuột (`#sp-lot-chuot`):** khung chi tiết có 7 ảnh và cũng có `data-auto`:
- `lot-chuot.jpg` (ảnh bìa thẻ) đứng đầu.
- Tiếp theo là 5 ảnh xưởng rộng 1000px, theo thứ tự khách chọn: Phong Vũ Game On (ngang 4:3), Win.D Gaming, Vạn Hưng, FC Online, GeForce RTX × Shuttlerock (các ảnh dọc 3:4).
- `lot-chuot-infographic.webp` đứng cuối.

**Ảnh lót chuột kính (`#sp-kinh`):** khung chi tiết có 5 ảnh và cũng có `data-auto`:
- `lot-chuot-kinh.jpg` (ảnh bìa thẻ) đứng đầu.
- Tiếp theo: Hatsune Miku tím, Luffy Gear 5, Hatsune Miku cỡ dài, One Piece Thousand Sunny.
- Bốn ảnh này có ảnh gốc chỉ rộng 736px, nên giữ nguyên cỡ, không phóng to.

**Ảnh phụ kiện (`#sp-phu-kien`):** khung chi tiết có 8 ảnh và cũng có `data-auto`:
- `phu-kien.webp` (ảnh bìa thẻ) đứng đầu.
- Tiếp theo: bàn phím Leaven K108W, đồng hồ gỗ LED, đồng hồ thời tiết mini, combo Panda, giá treo tai nghe, combo bàn ghế, móc khóa keycap FPT.
- Các ảnh 600px giữ nguyên cỡ.

Ảnh mới cho dải tự cuộn nên rộng 1000px, tỉ lệ vuông hoặc 2:3.

Muốn sửa mô tả hoặc giá sản phẩm thì sửa trong `<template>`, không sửa chữ trên thẻ. Phần chữ trên thẻ (`.pc-txt`) chỉ là đoạn giới thiệu ngắn. Trong `<template>` không còn nút "Nhận báo giá …", vì khách yêu cầu bỏ; khối liên hệ Mr. Sơn được JS tự gắn vào cuối khung chi tiết.

**Tinh gọn toàn trang:** khối CSS "TINH GỌN TOÀN TRANG" ở cuối `css/style.css`. Khối này làm các việc sau:
- Giảm khoảng cách giữa các mục: `.sec` dùng padding 72px trên máy tính và 52px từ 860px trở xuống.
- Trên điện thoại, sơ đồ "Vật dụng hằng ngày" xếp thành một cột.
- Ô email và ô địa chỉ ở mục liên hệ không bị xuống dòng.

**Cân đối toàn trang:** khối CSS "CÂN ĐỐI TOÀN TRANG" ở cuối `css/style.css`.
- **Mục 02 Sản phẩm** giữ **bố cục so le** (`.prow-1`, `.prow-2`, chữ nền "LACDAU"). Khách đã cho thử lưới 5 thẻ đều nhau rồi yêu cầu hoàn trả, nên **đừng đổi bố cục này** nếu khách không yêu cầu.
- **Dự án (`.gallery`):** 12 ảnh nhỏ xếp 6 cột × 2 hàng (4 cột từ 980px trở xuống, 3 cột từ 640px trở xuống). Bấm ảnh vẫn mở lightbox.

Nút "Bấm để xem báo giá" (`.sec-cta`) chỉ còn **một nút**, đặt sau mục 04 Dự án. Không thêm lại nút này vào cuối mỗi mục.

**Form đăng ký nhận báo giá (`#dang-ky`):** nằm ngay trên mục liên hệ, khách yêu cầu dựng theo mẫu form "Liên hệ phân phối" của MZLAB nhưng với nội dung Lắc Đầu. CSS ở khối "ĐĂNG KÝ NHẬN BÁO GIÁ", JS ở đoạn "Form đăng ký nhận báo giá" trong `js/main.js`.
- Bên trái là thẻ xanh đậm `.reg-info`: tiêu đề, 4 ý mạnh và hotline/email/địa chỉ.
- Bên phải là form trắng `#reg-form` gồm các ô:
  - "Bạn là": 4 nhóm khách giống mục 01, dạng nút radio.
  - Họ tên * và số điện thoại *.
  - Email.
  - Sản phẩm quan tâm (`<select>` 5 sản phẩm + "Nhiều sản phẩm").
  - Lời nhắn.
- Gửi bằng `fetch` tới `https://formsubmit.co/ajax/hoangson7423@gmail.com` (dịch vụ FormSubmit, không cần máy chủ). Thư về **hoangson7423@gmail.com**, dạng bảng, tiêu đề "Lacdau.com – Yêu cầu báo giá mới". Tên ô (`name`) bằng tiếng Việt chính là nhãn hiện trong thư.
- **Lần gửi đầu tiên** FormSubmit gửi thư kích hoạt về Gmail đó. Chủ trang phải bấm xác nhận thì các lần sau mới nhận được. Sau khi kích hoạt, FormSubmit cho một mã ngẫu nhiên; có thể thay địa chỉ Gmail trong URL bằng mã đó để giấu email khỏi mã nguồn.
- JS kiểm tra họ tên, số điện thoại Việt Nam (10–11 số, đầu 0 hoặc +84) và email (nếu có nhập), rồi báo lỗi ngay dưới nút. Ô ẩn `_honey` dùng để chặn bot spam.
- Báo lỗi theo từng lý do:
  - Mở trang dạng `file://` (F5 mặc định): FormSubmit không nhận form từ file trên máy, nên JS chặn gửi và báo mở qua máy chủ thử.
  - Form chưa kích hoạt: nhắc bấm "Activate Form" trong Gmail.
  - Các lỗi khác: nhắc gọi hoặc nhắn Zalo 088.611.5561.
- Muốn gửi thử trên máy thì trong ô Run and Debug chọn cấu hình **"Mở qua máy chủ thử (gửi form được)"**. Cấu hình này dùng `debugpy` (tiện ích Python của VS Code) để chạy `python3 -m http.server 5500`. Khi máy chủ in dòng "Serving HTTP … port 5500", `serverReadyAction` tự mở `http://localhost:5500/index.html` bằng trình duyệt mặc định. Dừng máy chủ bằng nút ■. Không dùng `preLaunchTask` với task chạy nền, vì cách đó làm VS Code nhảy vào launch.json thay vì mở trang.
- Không tự gửi thử form khi kiểm tra; trong test phải thay `window.fetch` bằng hàm giả.
- Nút "Nhận báo giá" ở ảnh bìa trỏ tới `#dang-ky`.

**Tối ưu điện thoại (≤640px):** khối "TỐI ƯU ĐIỆN THOẠI" ở cuối `css/style.css` làm các việc sau:
- Ẩn nhãn chữ đè trên ảnh dự án nhỏ.
- Mục liên hệ không hiện mã QR, chỉ giữ tên và số gọi, căn trái.
- Ô nhập trong form cỡ chữ 16px, để iPhone không tự phóng to trang khi khách bấm vào ô.
- Ẩn hotline/email/địa chỉ trong thẻ đăng ký, vì mục liên hệ ngay bên dưới đã có.

Đầu trang trên điện thoại (khối "ĐIỆN THOẠI · ĐẦU TRANG GỌN"):
- Tiêu đề nhỏ hơn và các khoảng cách gọn lại.
- Hai nút "Xem sản phẩm" / "Nhận báo giá" nhỏ lại và **đứng cùng một hàng**, mỗi nút chiếm một nửa.
- Nhờ vậy màn hình đầu tiên thấy được cả 4 ô năng lực.

**Mục 01 trên điện thoại hiện đủ thông tin** (khối "ĐIỆN THOẠI · MỤC 01 HIỆN ĐỦ THÔNG TIN"). Khách không muốn bị mất chữ trên điện thoại, nên từ 640px trở xuống:
- Không thu gọn `.ab-text` và không có nút "Xem thêm".
- 4 thẻ khách hàng `.seg` hiện đủ mô tả và nhãn, không có "Xem chi tiết →".

Việc rút gọn chỉ áp dụng cho máy tính và iPad.

**Điện thoại + iPad (≤1180px): nút tab mở trang riêng** (khối CSS "ĐIỆN THOẠI + IPAD (≤1180px) · NÚT TAB MỞ TRANG RIÊNG"; JS ở đoạn "Trang riêng #gs" trong `js/main.js`; HTML `#gs` nằm ngay trước `#pd`):
- Áp dụng cho mục 01 (3 nút) và mục 03 (6 bước). Trên trang chỉ còn các nút có mũi tên ›, xếp lưới:
  - mục 01: 3 cột trên iPad, 1 cột trên điện thoại;
  - mục 03: có **mũi tên nối các bước** (khối "MŨI TÊN NỐI CÁC BƯỚC QUY TRÌNH", vẽ bằng `::after` của từng nút trừ bước cuối).
    - iPad: 3 cột xếp kiểu chữ S. Hàng trên 01→02→03, mũi tên xuống, hàng dưới 04←05←06 (04 nằm dưới 03; đặt bằng `grid-area` theo `nth-child`).
    - Điện thoại: 1 cột, mũi tên ↓ giữa các bước.
- Bấm nút thì trang riêng `#gs` trượt vào từ bên phải, đè lên trang chính (giống khung chi tiết sản phẩm).
  - Đầu trang có kicker của mục và tên nút. **Không đặt chữ hướng dẫn thao tác** (kiểu "Vuốt sang phải để quay lại") vào trang, vì khách không muốn.
  - Nội dung là bản sao của chữ giới thiệu `[data-tab-for]` và `.tab-panel`. Bản sao bỏ id, bỏ nút "Xem thêm", hiện đủ mô tả và nhãn thẻ khách hàng.
  - Nút "Bước tiếp theo" trong trang riêng chuyển sang bước sau ngay trong trang.
- Có 4 cách đóng: nút ×, phím Esc, bấm nền mờ, hoặc **vuốt sang trái hoặc sang phải**. Khi vuốt, trang chạy theo ngón tay theo cả hai chiều (vuốt sang trái thì trang trượt ra bên trái); thả ra quá 90px hoặc vuốt nhanh thì đóng, chưa đủ thì trang bật lại. Panel có `touch-action:pan-y` để vẫn cuộn dọc được.
- Trang chính giữ nguyên vị trí cuộn (dùng lại class khóa cuộn `html.pd-lock`).
- JS gắn class `.gt-sheet` lên `.gtabs` khi `(max-width:1180px)` khớp. Từ 1181px trở lên vẫn là kiểu tab cũ, nội dung hiện ngay dưới nút.
- Kiểu "nút xổ xuống" trên điện thoại làm trước đó đã được bỏ và thay bằng trang riêng. Bản sao lưu trước khi đổi nằm trong thư mục tạm của phiên làm việc.
- Nhãn nút có thể khác nhau giữa điện thoại và máy tính: `<span class="lbl-pc">` hiện từ 641px, `<span class="lbl-mb">` chỉ hiện trên điện thoại. Nút 01 trên điện thoại ghi "Nhận diện thương hiệu với vật dụng hằng ngày của khách hàng"; trên máy tính vẫn là "Xuất thân từ 10 năm kinh nghiệm bán lẻ".

**Ảnh bìa 3D trên điện thoại:** hiện mô hình 3D (lót chuột + bàn phím) dưới 2 nút, ẩn ô chú thích. Chi tiết ở skill `anh-bia-3d`.

Khi chụp kiểm tra điện thoại, dùng khung cao đúng màn hình (390×844). Khung quá cao làm ảnh bìa (vừa một màn hình) lộ khoảng trống giả.

**Bảng giá (`.tbl`):** mỗi `<td>` phải có `data-l="<tên cột>"`, vì ở dạng thẻ nhãn cột được hiển thị qua `td::before`. Hàm JS `fitTables()` tự thêm class `.tbl-cards` khi bảng không đủ chỗ hiện hết các cột.

**Liên hệ (`#lien-he`) và footer:**
- Số liên hệ duy nhất trên trang là **Mr. Sơn 088.611.5561**.
- Mọi nút Zalo trỏ tới `https://zalo.me/0886115561`, vì link này mở thẳng khung chat Zalo. Không dùng link `zaloapp.com/qr/p/…`: đó chỉ là trang để quét mã, bấm vào không mở Zalo. Ảnh mã QR thì vẫn giữ nguyên. Số dùng ở nút gọi, nút Zalo, khối QR `.c-qr`, nút nổi `.fab` và `#qm`.
- Số cũ 034.929.6461 đã bị khách yêu cầu bỏ, không được thêm lại.
- Ảnh mã QR trong `.c-qr` là bản sao của ảnh QR trong `#qm .qm-qr`. Đổi QR thì phải thay ở cả hai chỗ.
- Footer chỉ còn khối thông tin pháp lý `.foot-legal`: tên đầy đủ, địa chỉ đăng ký 72 ngõ 168 Phan Trọng Tuệ, chủ sở hữu, số GCN ĐKKD 0109583374. Dòng bản quyền và MST ở cuối footer đã bị khách yêu cầu bỏ.

**Nút tab gom nội dung (`.gtabs`):** hai mục được gom vào hàng nút cho gọn trang. Mỗi nút ghi tiêu đề một mục nhỏ, bấm nút nào thì nội dung mục đó hiện bên dưới. Hai mục gồm:
- `#gioi-thieu` "Tầm nhìn và định hướng" (`.sec-about`, `.gtabs-about`) dựng theo mẫu khách gửi, CSS ở khối "MỤC 01 THEO MẪU MỚI":
  - Nền trắng.
  - Hàng trên `.ab-head`: bên trái là kicker "01 / Tầm nhìn và định hướng" và `<h2>`. Bên phải là `.ab-intro[data-tab-for="n"]`, phần chữ của nút đang chọn; JS ẩn/hiện theo số thứ tự nút.
  - 3 nút tách riêng, mỗi nút có khung và số 01–03 (CSS counter). Nút đang chọn tô `--g-700`. Máy tính và máy tính bảng xếp 3 cột; từ 640px trở xuống xếp chồng dọc để luôn thấy đủ 3 nút.
  - Nội dung bên dưới nằm trong khung xanh nhạt `.ab-box`:
    - Nút 1 là sơ đồ `.flow`, gồm "Nhận diện thương hiệu" → ô "Vật dụng hằng ngày" → "Kết nối mỗi ngày". Sơ đồ cân đối: hai cột chữ rộng bằng nhau (200px), ô giữa rộng 260px và nằm đúng tâm khung.
    - Nút 2 là "3 lợi ích" (`.b-list`, đánh số 01–03), CSS ở khối "MỤC 01 · 3 LỢI ÍCH DẠNG THẺ". Mỗi lợi ích là một thẻ trắng riêng có viền trên xanh, biểu tượng `.b-ic` (mắt, cặp tài liệu, giỏ hàng), số lớn mờ ở góc phải và tên lợi ích đậm. Máy tính và iPad (từ 641px) xếp 3 cột; từ 640px trở xuống (điện thoại) xếp chồng, biểu tượng nằm bên trái chữ. Thẻ khách hàng `.seg` xếp 4 cột từ 861px, 2 cột trên iPad dọc, 1 cột trên điện thoại (khối "MỤC 01 · TỐI ƯU IPAD").
    - Nút 3 là các thẻ khách hàng `.seg`, vẫn mở `#sm`. Thẻ trong lưới được **rút gọn** (khối CSS "MỤC 01 · THẺ KHÁCH HÀNG RÚT GỌN"): chỉ hiện biểu tượng, số, tiêu đề và dòng "Xem chi tiết →". Mô tả `<p>` và nhãn `.seg-tags` bị ẩn bằng CSS nhưng vẫn nằm trong HTML, nên bấm thẻ thì `#sm` hiện đầy đủ.
  - Đoạn chữ bên phải nằm trong `.ab-text` và được thu gọn còn 2 dòng, có nút `.ab-toggle` "Xem thêm" / "Thu gọn". Hàm JS `fitMore()` chỉ hiện nút khi chữ thật sự dài hơn 2 dòng, và chạy lại khi đổi nút tab hoặc đổi cỡ màn hình.
  - Chữ cũ giữ nguyên. Chỉ thêm 2 nhãn mới theo mẫu: "Nhận diện thương hiệu" và "Kết nối mỗi ngày".
- `#quy-trinh` "Quy trình làm việc" (`.gtabs-steps`) có 6 nút bước. Nội dung mỗi bước là một `.step-card` gồm biểu tượng, tiêu đề, mô tả và nút "Bước tiếp theo" (`[data-tab-go]`).
  - Dòng thời gian dạng sóng `.ptl` đã bỏ khỏi HTML. CSS cũ của `.ptl`/`.pstep` vẫn còn trong file nhưng không còn dùng.

Cách hoạt động:
- JS nằm ở đoạn "Nút tab" trong `js/main.js`. Có thể chuyển nút bằng phím ←/→/Home/End.
- Từ 980px trở xuống, hàng nút cuộn ngang.
- Đừng đặt tên `.tabs`, vì CSS cũ đã có class `.tabs` cho kiểu tab khác.
- Muốn sửa nội dung thì sửa trong `.tab-panel` tương ứng; nhãn nút nằm ở `.tab-btn`.

**Cửa sổ mini `#sm` (mục "Định hướng phát triển & khách hàng phù hợp"):**
- Bấm hoặc nhấn Enter vào một thẻ `.seg` sẽ mở cửa sổ mini, nội dung lấy từ `innerHTML` của thẻ đó. Vì vậy sửa nội dung trong thẻ `.seg` là cửa sổ tự cập nhật theo.
- Chuyển bước bằng nút ‹ ›, chấm tròn, phím ←/→ hoặc vuốt ngang trên điện thoại. Đóng bằng Esc, nút × hoặc bấm ra ngoài.
- Trên điện thoại, cửa sổ trồi lên từ đáy màn hình.

**Bảng báo giá `#qm`:** mở từ bất kỳ nút nào có `[data-open-qm]`. Mỗi mục `.qm-item[data-card="<id của article>"]` mở khung chi tiết của sản phẩm tương ứng.

## Đầu trang và ảnh bìa (theo mẫu khách gửi)

Bố cục khung menu `.nav-top` + `.nav-bar` lấy từ khối "MENU KIỂU LOGITECH". Màu sắc, bố cục chi tiết và phần ảnh bìa nằm ở khối "ĐẦU TRANG THEO MẪU MỚI" ở cuối `css/style.css`, khối này ghi đè khối Logitech.

**Dải trên `.nav-top`:**
- Nền xanh đậm `--g-900`, cao 36px.
- Bên trái là câu `.nav-top-tag` "Cá nhân hóa sản phẩm · Giá trực tiếp tận xưởng".
- Bên phải là `.nav-top-links`: Zalo tư vấn, email, Mr. Sơn 088.611.5561.
- Dải này ẩn từ 860px trở xuống.

**Thanh menu `.nav-bar`:**
- Nền trắng (khối "ĐẦU TRANG NỀN TRẮNG" ở cuối `css/style.css`; trước đây là kem `--cream`), có viền mảnh ở dưới.
- Bên trái **chỉ có logo**. Chữ "LACDAU.COM" (`.nav-brand`) đã bị khách yêu cầu xóa khỏi HTML; CSS cũ của `.nav-brand` vẫn còn nhưng không dùng.
- Các mục menu nằm **đúng giữa chiều ngang trang** từ 861px trở lên (khối "MENU NẰM GIỮA TRANG"): `.nav-in` là lưới 3 cột `1fr auto 1fr`, logo ở cột trái, menu ở cột giữa. Không căn giữa theo khoảng trống còn lại sau logo, vì như vậy menu bị lệch phải.
- Nút "Liên hệ báo giá ↗" góc vuông, nền `--g-700`. Từ 861px trở lên, nút được đặt `position:absolute` ở bên phải. Trong khoảng 861–1100px, menu vẫn nằm giữa và không đè lên nút (đã đo ở 861, 900 và 1024px).
- Khi cuộn (`.nav.solid`), từ 861px trở lên dải trên ẩn đi.
- Khách yêu cầu **không có** thanh tìm kiếm, tài khoản và nút chuyển ngôn ngữ.

**Ảnh bìa `.hero`:**
- Nền trắng (khối "ĐẦU TRANG NỀN TRẮNG").
- Dòng nhỏ `.hero-kicker` "Hồ sơ năng lực · LACDAU.COM · 05/2026".
- `<h1>` "Dấu ấn riêng. Nâng tầm thương hiệu.", trong đó dòng cuối nằm trong `<span>`, màu `--g-700`.
- Đoạn mô tả, hai nút `.hbtn` góc vuông có mũi tên ↗ (`.hbtn-fill` nền đặc, `.hbtn-line` viền), và dòng khẩu hiệu.
- Bên phải vẫn là **mô hình 3D giữ nguyên**.
- Bên dưới là hàng năng lực `.hero-cap` trải hết chiều ngang, 4 cột (2 cột từ 860px trở xuống): số lớn, nhãn và dòng phụ nhỏ. Các số `7+` và `10` vẫn chạy đếm nhờ `data-count`.
- Mũi tên ↗ dùng chung `svg.i-arrow`.

## Logo

- Logo Lắc Đầu đã được tách nền, lưu thành PNG trong suốt 234×163 (file `images/logo/logo-lac-dau.png`, dùng trong `.nav-logo`).
- Logo nằm ở góc trái thanh menu, ngay trước các mục menu, và trỏ tới `https://lacdau.com`.
- Chiều cao logo (khối "LOGO KHÔNG KÈM CHỮ"): 56px trên máy tính, 52px trong khoảng 861–1100px, 48px trên điện thoại.
- Thanh menu cao `--nav-bar: 76px` (68px từ 860px trở xuống) để logo cách mép trên và dưới khoảng 10px.
- Từ 861px trở lên, logo nằm **giữa hai vị trí**: vị trí cũ (sát mép trái khung trang) và điểm giữa khoảng từ mép trái tới chữ đầu tiên của menu ("Giới thiệu"). Đây là vị trí khách chốt sau 2 lần thử.
  - Logo ở cột 1 của lưới `.nav-in` (`column-gap:0`, `justify-self:start`). Lề trái là `calc((100% + đệm menu − bề rộng logo) / 4)`, trong đó `%` tính theo bề rộng cột 1. Bộ số là 12px/80px, hoặc 9px/75px trong khoảng 861–1100px.
  - Nếu đổi cỡ logo thì sửa bề rộng logo trong công thức.
  - Đã đo ở 900, 1024, 1280 và 1440px: lệch không quá 1px.
- Trên điện thoại logo vẫn ở sát trái, cạnh nút ☰.
- JSON-LD `Organization.logo` trỏ tới `https://lacdau.com/images/logo/logo-lac-dau.png`.

## Ảnh bìa nền trắng

Ảnh bìa `.hero` dùng nền trắng. Khối CSS "ẢNH BÌA NỀN TRẮNG" trong `css/style.css` ghi đè các quy tắc cũ (vốn viết cho nền xanh, chữ trắng):
- Chữ, nút `.btn-white` / `.btn-line` trong hero và các ô thống kê chuyển sang tông xanh đậm.
- Menu lúc chưa cuộn (`.nav:not(.solid)`) dùng chữ tối, nút CTA xanh.
- Dải logo khách hàng nền xám nhạt.
- Logo khách hàng **đứng yên trên một hàng**, không còn chạy ngang và không nhân bản logo. 15 logo co giãn kích thước bằng `clamp()` để vừa một hàng từ 641px trở lên. Từ 640px trở xuống thì xuống dòng.
- Rê chuột vào hàng logo sẽ phóng to kiểu **thanh Dock macOS**. Phần JS nằm ở đoạn "Logo khách hàng" trong `js/main.js` và chỉ chạy khi thiết bị có chuột (`hover:hover and pointer:fine`):
  - Độ phóng của mỗi logo tính theo khoảng cách tới con trỏ, dùng đường cong cosin với `MAX = 1.85` và `RANGE = 160px`.
  - Mỗi khung `requestAnimationFrame` nội suy độ phóng về giá trị đích với hệ số `EASE = 0.22`, nên logo nở ra và thu lại đều tay, không dùng CSS transition.
  - Phần nở thêm được cộng dồn để `translateX` đẩy các logo ra hai bên, giữ tâm hàng cố định.
  - `.clients{overflow-x:clip}` chặn trang bị cuộn ngang khi hàng giãn ra. `.marquee` có `padding-top:60px` (bù bằng margin âm) để logo phóng to không bị cắt.
  - Trên khổ điện thoại (≤640px) logo **không phóng to**, kể cả khi xem giả lập bằng chuột: JS bỏ qua `pointermove` khi `(max-width:640px)` khớp, CSS cũng chặn `transform`. Khách yêu cầu.
  - Lưu ý khi kiểm tra: Chrome headless không chạy `requestAnimationFrame` khi bật `--force-prefers-reduced-motion`, nên muốn chụp hiệu ứng này thì phải bỏ cờ đó.

Nếu sửa màu ảnh bìa, hãy sửa trong khối này, không sửa các quy tắc gốc phía trên.

## Skill của dự án

- `anh-bia-3d`: chi tiết ảnh bìa 3D. Đọc skill này trước khi sửa phần 3D.
- `kiem-tra-giao-dien`: cách kiểm tra giao diện bằng Chrome headless. Dùng sau mỗi lần sửa giao diện.
