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

## SEO

- `<head>` gồm:
  - tiêu đề và mô tả chứa từ khóa chính (in lót chuột, keycaps, cốc theo yêu cầu, giá tận xưởng);
  - canonical `https://lacdau.com/`, thẻ robots, Open Graph và Twitter card đầy đủ;
  - favicon dạng SVG inline.
- `og:image` và `twitter:image` trỏ tới `https://lacdau.com/images/seo/og-image.jpg` (file `images/seo/og-image.jpg` cỡ 1200×630). Không được đổi lại thành data URI, vì Facebook và Zalo không đọc được dạng đó.
- JSON-LD (`application/ld+json` trong `<head>`) có `@graph` gồm 3 phần: `Organization`/`LocalBusiness` (địa chỉ, số Mr. Sơn, MST), `WebSite` và `ItemList` 5 sản phẩm. Giá trong `AggregateOffer` lấy từ bảng giá trên trang. Khi đổi giá, số điện thoại hoặc địa chỉ thì phải sửa cả ở JSON-LD.
- Hai file `robots.txt` và `sitemap.xml` giả định cả thư mục được đưa lên gốc tên miền `https://lacdau.com/`. Nếu đưa lên đường dẫn khác thì phải sửa canonical, `og:url`, các URL ảnh và sitemap.
- Khi sửa `lastmod` trong `sitemap.xml`, ghi ngày của lần cập nhật nội dung.

## Chạy trang

- Mở trực tiếp: `open index.html`.
- Trong VS Code nhấn F5: `.vscode/launch.json` mở thẳng `index.html` bằng Chrome, không cần server.
- Mở bằng `file://` vẫn chạy đủ cả 3D, vì hai lý do:
  - `js/hero3d.js` là script thường, nạp Three.js bằng `import()` động qua importmap trong `index.html`. Script `type="module"` có `src` thì bị Chrome chặn trên `file://`.
  - 4 ảnh mặt 3D giữ dạng base64 trong `js/hero3d-textures.js`. Ảnh `file://` không dùng làm texture WebGL được, vì bị coi là khác nguồn.

  Đừng đổi hai chỗ này về module hoặc file ảnh.

## Cấu trúc trang

Cuối `index.html` nạp lần lượt: `js/main.js` → importmap → `js/hero3d-textures.js` → `js/hero3d.js`. Đường dẫn ảnh trong HTML là tương đối (`images/...`).

Các mục có anchor id lần lượt là `#gioi-thieu` (01), `#san-pham` (02), `#quy-trinh` (03), `#du-an` (04) và `#lien-he`. Đầu mỗi mục có ô số thứ tự (`.sec-num`) và dòng nhãn nhỏ (`.sec-kicker`).

**CSS được viết thêm dần thành nhiều lớp.** Các khối viết sau cố ý ghi đè khối trước: menu căn giữa không logo, ảnh bìa vừa một màn hình, bố cục sản phẩm so le, dòng thời gian dạng sóng và khối "TỐI ƯU MỌI KÍCH THƯỚC MÀN HÌNH" ở cuối. Trước khi sửa một quy tắc, hãy grep selector đó vì nó có thể bị định nghĩa lại ở phía dưới. Phần ghi đè mới thì thêm vào cuối `css/style.css`. Comment trong code viết bằng tiếng Việt, giữ nguyên phong cách này.

Các mốc breakpoint là 1100 / 980 / 860 / 640 / 440 / 360px:
- Từ 860px trở xuống, menu chuyển sang nút hamburger.
- Từ 980px trở xuống, dòng thời gian chuyển sang dạng dọc.
- Từ 640px trở xuống, bảng giá chuyển sang dạng thẻ.
- `(hover:none)` tắt các hiệu ứng rê chuột trên thiết bị cảm ứng.

**Nội dung sản phẩm nằm trong `<template class="pc-detail">` của từng `article.pc`** (id `sp-lot-chuot`, `sp-keycaps`, `sp-coc`, `sp-kinh`, `sp-phu-kien`). Hàm JS `openDetail()` sao chép template vào hộp thoại `#pd`:
- Ảnh trong `.d-imgs img` trở thành các khung ảnh. Nếu chỉ có một ảnh dọc (thuộc tính height lớn hơn width) thì khung chi tiết nhận class `.pd-portrait`. Nếu có nhiều ảnh thì nhận `.pd-multi`.
- `.d-body` trở thành cột nội dung bên phải.
- Khối liên hệ `#qm .qm-contact` được sao chép vào cuối mọi khung chi tiết sản phẩm. Vì vậy sửa thông tin liên hệ trong `#qm` sẽ cập nhật ở mọi nơi.

**Ảnh keycaps (`#sp-keycaps`):**
- Ảnh bìa thẻ là ảnh "Keycap Việt Nam" **nguyên khung, không cắt** (600×600). CSS `#sp-keycaps .pc-img{aspect-ratio:1/1}` để khung thẻ vừa đúng ảnh. Nếu đổi sang ảnh có tỉ lệ khác thì sửa `aspect-ratio` theo ảnh.
- Khung chi tiết có 5 ảnh: Keycap Việt Nam, One Piece (ảnh cầm tay), Hatsune Miku, One Piece White Orange V1, bộ cam đen. Ba ảnh vuông 600px giữ nguyên cỡ gốc; hai ảnh cầm tay rộng 1000px.
- `.d-imgs` của keycaps có thuộc tính `data-auto`. Khi mở khung chi tiết, JS nhân đôi dải ảnh và thêm class `.pd-panel.pd-auto`, rồi `autoLoop()` dịch `.pd-frames` lên đều với tốc độ `AUTO_SPEED = 150` px/giây, cuộn vòng liền mạch.
  - Rê chuột hoặc chạm vào cột ảnh thì dải dừng; lăn chuột thì tua.
  - Khi bật `prefers-reduced-motion`, dải ảnh không tự chạy mà cuộn tay như các sản phẩm khác.
  - Muốn sản phẩm khác cũng tự cuộn thì thêm `data-auto` vào `.d-imgs` của sản phẩm đó.
- Ảnh nhỏ của keycaps ở menu thả xuống và trong `#qm` là ảnh cắt 160×160 từ ảnh Keycap Việt Nam.

Muốn sửa mô tả hoặc giá sản phẩm thì sửa trong `<template>`, không sửa chữ trên thẻ. Phần chữ trên thẻ (`.pc-txt`) chỉ là đoạn giới thiệu ngắn. Trong `<template>` không còn nút "Nhận báo giá …", vì khách yêu cầu bỏ; khối liên hệ Mr. Sơn được JS tự gắn vào cuối khung chi tiết.

**Bảng giá (`.tbl`):** mỗi `<td>` phải có `data-l="<tên cột>"`, vì ở dạng thẻ nhãn cột được hiển thị qua `td::before`. Hàm JS `fitTables()` tự thêm class `.tbl-cards` khi bảng không đủ chỗ hiện hết các cột.

**Liên hệ (`#lien-he`) và footer:**
- Số liên hệ duy nhất trên trang là **Mr. Sơn 088.611.5561**, Zalo `https://zaloapp.com/qr/p/lxnm1ewj4u3a`. Số dùng ở nút gọi, nút Zalo, khối QR `.c-qr`, nút nổi `.fab` và `#qm`.
- Số cũ 034.929.6461 đã bị khách yêu cầu bỏ, không được thêm lại.
- Ảnh mã QR trong `.c-qr` là bản sao của ảnh QR trong `#qm .qm-qr`. Đổi QR thì phải thay ở cả hai chỗ.
- Footer chỉ còn khối thông tin pháp lý `.foot-legal`: tên đầy đủ, địa chỉ đăng ký 72 ngõ 168 Phan Trọng Tuệ, chủ sở hữu, số GCN ĐKKD 0109583374. Dòng bản quyền và MST ở cuối footer đã bị khách yêu cầu bỏ.

**Cửa sổ mini `#sm` (mục "Định hướng phát triển & khách hàng phù hợp"):**
- Bấm hoặc nhấn Enter vào một thẻ `.seg` sẽ mở cửa sổ mini, nội dung lấy từ `innerHTML` của thẻ đó. Vì vậy sửa nội dung trong thẻ `.seg` là cửa sổ tự cập nhật theo.
- Chuyển bước bằng nút ‹ ›, chấm tròn, phím ←/→ hoặc vuốt ngang trên điện thoại. Đóng bằng Esc, nút × hoặc bấm ra ngoài.
- Trên điện thoại, cửa sổ trồi lên từ đáy màn hình.

**Bảng báo giá `#qm`:** mở từ bất kỳ nút nào có `[data-open-qm]`. Mỗi mục `.qm-item[data-card="<id của article>"]` mở khung chi tiết của sản phẩm tương ứng.

## Logo

- Logo Lắc Đầu đã được tách nền, lưu thành PNG trong suốt 234×163 (file `images/logo/logo-lac-dau.png`, dùng trong `.nav-logo`).
- Logo nằm ở góc trái thanh menu (`position:absolute`, vì `.nav-in` căn giữa menu) và trỏ tới `https://lacdau.com`.
- Chiều cao logo: 60px trên máy tính, 52px trong khoảng 861–1100px, 54px trên điện thoại.
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
  - Lưu ý khi kiểm tra: Chrome headless không chạy `requestAnimationFrame` khi bật `--force-prefers-reduced-motion`, nên muốn chụp hiệu ứng này thì phải bỏ cờ đó.

Nếu sửa màu ảnh bìa, hãy sửa trong khối này, không sửa các quy tắc gốc phía trên.

## Skill của dự án

- `anh-bia-3d`: chi tiết ảnh bìa 3D. Đọc skill này trước khi sửa phần 3D.
- `kiem-tra-giao-dien`: cách kiểm tra giao diện bằng Chrome headless. Dùng sau mỗi lần sửa giao diện.
