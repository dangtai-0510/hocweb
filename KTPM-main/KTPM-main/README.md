# DevShortcuts — Sổ Tay Phím Tắt Lập Trình Viên

Ứng dụng web tra cứu phím tắt dành cho lập trình viên. Giao diện đơn giản, tìm kiếm nhanh, hỗ trợ thêm phím tắt tùy chỉnh.

---

## Cấu trúc thư mục

```
DevShortcutOrganizer/
├── index.html      # Giao diện chính
├── style.css       # Giao diện dark mode, responsive
├── app.js          # Logic tìm kiếm, filter, thêm phím tắt
├── data.json       # 50 phím tắt có sẵn
└── README.md
```

---

## Cách chạy

> Không mở `index.html` trực tiếp bằng trình duyệt (double-click) vì trình duyệt chặn `fetch()` với giao thức `file://`.

### Cách 1 — Python (khuyến nghị)
```bash
cd DevShortcutOrganizer
python -m http.server 8080
```
Mở trình duyệt tại: [http://localhost:8080](http://localhost:8080)

### Cách 2 — VS Code Live Server
1. Cài extension **Live Server** trong VS Code
2. Chuột phải vào `index.html` → **Open with Live Server**

### Cách 3 — Node.js
```bash
npx serve .
```

---

## Tính năng

| Tính năng | Mô tả |
|---|---|
| Tìm kiếm realtime | Tìm theo tên chức năng, tổ hợp phím, hoặc tên phần mềm |
| Filter | Lọc theo phần mềm và hệ điều hành |
| Thêm tùy chỉnh | Thêm phím tắt cá nhân, lưu vào `localStorage` |
| Kiểm tra trùng lặp | Không cho thêm nếu cùng phần mềm + cùng tổ hợp phím |
| Trợ giúp | Nhấn nút `?` ở góc trên phải để xem hướng dẫn |
| Phím tắt | Nhấn `Esc` để đóng hộp thoại |

---

## Phần mềm hỗ trợ sẵn

- **VS Code** — 12 phím tắt
- **Terminal** — 8 phím tắt
- **IntelliJ IDEA** — 7 phím tắt
- **Git (CLI)** — 7 phím tắt
- **Chrome DevTools** — 8 phím tắt
- **Vim** — 8 phím tắt

---

## Thêm dữ liệu vào data.json

Mở `data.json` và thêm object vào mảng `shortcuts`:

```json
{
  "id": 51,
  "software": "Tên phần mềm",
  "action": "Mô tả chức năng",
  "keys": "Ctrl + K",
  "os": "Windows/Linux"
}
```

Giá trị `os` hợp lệ: `"Windows/Linux"` | `"macOS"` | `"Tất cả"` | `"Windows/Linux/macOS"`

---

## Lưu trữ phím tắt tùy chỉnh

Phím tắt do người dùng thêm được lưu vào `localStorage` với key `devshortcuts_custom`.  
Dữ liệu tồn tại sau khi tắt trình duyệt, xóa khi xóa cache trình duyệt.

---

## Công nghệ sử dụng

- HTML5 / CSS3 / JavaScript (ES6+) — không dùng framework
- `localStorage` API để lưu dữ liệu tùy chỉnh
- `fetch()` API để tải `data.json`

---

## Nhóm phát triển

| Thành viên | MSSV  |
|---|---|
| Vũ Xuân Trường | 24107720 |
| Đặng Đức Tài | 24107665 |
