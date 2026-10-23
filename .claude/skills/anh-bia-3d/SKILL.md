---
name: anh-bia-3d
description: Cách hoạt động và cách chỉnh ảnh bìa 3D (lót chuột + bàn phím Three.js) trong index.html – dùng khi sửa mô hình, ảnh mặt, chú thích, tốc độ xoay hoặc đế trưng bày.
---

# Ảnh bìa 3D (lót chuột + bàn phím)

`.hero-art` chứa:
- `canvas.h3d-canvas`;
- lớp chú thích `.h3d-callouts`, gồm các ô `.h3d-co[data-g="pad"|"kb"]` và mũi tên SVG `.h3d-lines line[data-g]`;
- 4 ảnh ghép `.ha` làm phương án dự phòng.

Module 3D chỉ thêm class `.is-3d` (ẩn ảnh ghép, hiện canvas) sau khi tải xong cả 4 ảnh. Vì vậy khi không có WebGL, mất mạng hoặc CDN lỗi, trang vẫn hiện ảnh ghép cũ.

- Three.js `0.160.0` được tải từ jsDelivr qua importmap (`three`, `three/addons/`), nên 3D cần có mạng.
- **Lót chuột 90×40cm** (`pad`), ở phía trên:
  - hai mặt `ShapeGeometry` bo góc, cộng một ống viền chỉ chạy quanh chu vi;
  - độ dày phóng lên 12mm để nhìn thấy viền.
- **Đế trưng bày tròn** hai tầng (`pedBase`, `pedTop`, cao `PED_H`) có viền đèn xanh `pedGlow`, đặt trên sàn. Đế đứng yên, không xoay.
- **Bàn phím 108 phím** (`kb`), dựng đứng trên mặt đế, phóng `KS = 1.75` lần cho cân với tấm lót. Lót chuột lơ lửng phía trên, cách bàn phím 0,17 (đơn vị cảnh). Các phần của mô hình:
  - **Thân:** vỏ `ExtrudeGeometry` 44×13,2cm, dày 24mm theo ảnh chụp cạnh.
  - **Keycap:** 6 khối `ROWS`, cao 7,6–9,4mm để ra dáng Cherry. Mặt trên mỗi khối lấy đúng lát tương ứng trong ảnh mặt phím, theo khoảng `v0`/`v1` trên trục chiều sâu.
  - **Toạ độ cục bộ:** +Y là cạnh sau (hàng F), +Z là mặt phím.
- Code nằm ở `js/hero3d.js` (script thường, nạp Three.js bằng `import()` động). **Ảnh thật** của sản phẩm nằm dạng base64 trong `js/hero3d-textures.js` (`window.LD_TEX`), gồm 4 khóa: `TEX_PAD_FRONT`, `TEX_PAD_BACK`, `TEX_KB_TOP`, `TEX_KB_BOTTOM`.
  - Mọi ảnh đều đã nắn phối cảnh và cắt sát mép vật thể, vì UV trải đúng toàn bộ khổ: lót chuột 2048×910 (2,25:1), bàn phím 2048×616 (3,33:1, hàng F ở trên).
  - Ảnh mặt đáy bàn phím đã được làm sạch: vùng nhựa vẽ lại cho phẳng (hết vân tay và ố); chân đế, tem, đầu thu USB, công tắc được chép lại từ ảnh thật.
  - Mặt sau được gắn vào geometry đã `rotateY(Math.PI)` với `u = 1 - u`. Vì vậy ảnh mặt sau là ảnh chụp sau khi lật vật thể đầu-đuôi, không cần lật gương.
- Hành vi:
  - Hai vật thể tự xoay tròn khoảng 12,5 giây một vòng.
  - Rê chuột: raycast xác định đang trỏ vào `pad` hay `kb`. Vật thể đó quay về góc trưng bày `show` trong mảng `items`; vật thể còn lại mờ xuống `opacity .18` và vẫn xoay. Sau khi vật thể đã đứng yên, `art.dataset.info` được đặt thành `pad` hoặc `kb`, làm hiện nhóm ô chú thích tương ứng. Rời chuột khỏi khung thì tắt chú thích.
  - Tốc độ phản hồi khi rê chuột nằm trong hàm `step()`:
    - hệ số quay về góc trưng bày `dt * 11`;
    - ngưỡng coi là "đã đứng yên" để hiện chú thích là 0.06 rad;
    - tốc độ làm mờ vật thể còn lại `dt * 14`.

    Ô chú thích hiện ra trong 0,2 giây (CSS `.h3d-co`). Muốn nhanh hay chậm hơn thì chỉnh các số này.
  - Màn hình cảm ứng: chạm vào vật thể để bật hoặc tắt. Focus bằng bàn phím sẽ mở chú thích lót chuột.
  - Lót chuột có 4 chú thích: `speed`, `stitch`, `size` (Size custom theo yêu cầu, chỉ vào cạnh trái) và `rubber`. Bàn phím có 4 chú thích: `profile`, `pbt`, `keys` và `box`.
  - Điểm neo của mũi tên nằm trong `anchors` (toạ độ cục bộ của từng vật thể). Vị trí các ô nằm trong CSS `.h3d-co[data-k=...]`, với lót chuột ở nửa trên và bàn phím ở nửa dưới. Nếu đổi `show`, camera hoặc bố cục thì phải chỉnh lại các vị trí này.
  - Khi bật `prefers-reduced-motion`, cả hai đứng yên ở góc `show`.
  - Trên điện thoại (từ 640px trở xuống), `.hero-art` bị ẩn nên module không khởi động.
