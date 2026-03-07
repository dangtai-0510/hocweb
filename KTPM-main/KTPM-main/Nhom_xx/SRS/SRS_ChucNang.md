# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
# Sổ Tay Phím Tắt Lập Trình Viên (DevShortcuts)

---

## 2. Các yêu cầu chức năng

### 2.1 Các tác nhân

| Tác nhân | Mô tả |
|---|---|
| Lập trình viên | Người dùng chính. Sử dụng hệ thống để tra cứu và quản lý phím tắt phục vụ công việc hàng ngày. |

> Hệ thống không yêu cầu đăng nhập. Mọi người dùng truy cập ứng dụng đều được xem là Lập trình viên.

---

### 2.2 Các chức năng của hệ thống

Hệ thống cung cấp 3 chức năng chính:

| Mã | Tên chức năng | Mô tả ngắn |
|---|---|---|
| UC-01 | Xem danh sách phím tắt | Hiển thị toàn bộ phím tắt từ dữ liệu có sẵn và phím tắt tùy chỉnh |
| UC-02 | Tìm kiếm phím tắt | Tìm kiếm theo từ khóa và lọc theo phần mềm / hệ điều hành |
| UC-03 | Thêm phím tắt tùy chỉnh | Cho phép người dùng thêm phím tắt cá nhân vào danh sách |

---

### 2.3 Biểu đồ use-case tổng quát

```
+-----------------------------------------------------+
|              He thong DevShortcuts                  |
|                                                     |
|   +----------+    +----------+   +--------------+  |
|   |  UC-01   |    |  UC-02   |   |    UC-03     |  |
|   |  Xem     |    |  Tim     |   |   Them phim  |  |
|   |  danh    |    |  kiem    |   |   tat tuy    |  |
|   |  sach    |    |  phim    |   |   chinh      |  |
|   +----------+    |  tat     |   +--------------+  |
|                   +----------+                     |
+-----------------------------------------------------+
          ^               ^               ^
          |               |               |
    +-----+---------------+---------------+-----+
    |             Lap trinh vien                |
    +--------------------------------------------+
```

> Lưu ý: File biểu đồ chính thức (draw.io / Lucidchart) nộp kèm trong thư mục "Bieu do".

---

### 2.4 Biểu đồ use-case phân rã

**UC-02 — Tìm kiếm phím tắt** được phân rã thành:

```
UC-02: Tim kiem phim tat
  |
  |-- UC-02a: Tim kiem theo tu khoa (ten chuc nang, to hop phim, ten phan mem)
  |-- UC-02b: Loc theo phan mem (VS Code, Terminal, IntelliJ IDEA, ...)
  |-- UC-02c: Loc theo he dieu hanh (Windows/Linux, macOS, Tat ca)
  |-- UC-02d: Hien thi ket qua khong tim thay (khi khong co ket qua phu hop)
```

**UC-03 — Thêm phím tắt tùy chỉnh** được phân rã thành:

```
UC-03: Them phim tat tuy chinh
  |
  |-- UC-03a: Nhap thong tin phim tat (phan mem, chuc nang, to hop phim, HDD)
  |-- UC-03b: Kiem tra trung lap
  |       |-- [Trung] Hien thi thong bao loi, huy them
  |       |-- [Khong trung] Luu vao localStorage
  |-- UC-03c: Cap nhat danh sach hien thi sau khi them thanh cong
```

---

### 2.5 Quy trình nghiệp vụ

#### Quy trình 1: Tra cứu phím tắt

```
[Bat dau]
    |
    v
Nguoi dung mo ung dung
    |
    v
He thong tai du lieu tu data.json va localStorage
    |
    v
Hien thi toan bo danh sach phim tat
    |
    v
Nguoi dung nhap tu khoa HOAC chon filter
    |
    v
He thong loc va hien thi ket qua theo thoi gian thuc
    |
    v
[Co ket qua?]---Khong---> Hien thi thong bao "Khong tim thay"
    |                            |
    | Co                         v
    v                     Goi y them phim tat moi
Hien thi danh sach ket qua
    |
    v
[Ket thuc]
```

#### Quy trình 2: Thêm phím tắt tùy chỉnh

```
[Bat dau]
    |
    v
Nguoi dung nhan nut "+"
    |
    v
He thong mo form nhap lieu
    |
    v
Nguoi dung dien: Phan mem, Chuc nang, To hop phim, He dieu hanh
    |
    v
Nguoi dung nhan "Luu phim tat"
    |
    v
He thong kiem tra trung lap
    |
    v
[Trung lap?]---Co---> Hien thi loi "Phim tat da ton tai", giu form
    |
    | Khong
    v
Luu vao localStorage
    |
    v
Cap nhat danh sach hien thi
    |
    v
Dong form
    |
    v
[Ket thuc]
```

---

### 2.6 Dac ta use-case

---

#### UC-01: Xem danh sach phim tat

| Truong | Noi dung |
|---|---|
| Ma use-case | UC-01 |
| Ten use-case | Xem danh sach phim tat |
| Tac nhan chinh | Lap trinh vien |
| Mo ta | Nguoi dung xem toan bo phim tat co san va phim tat tuy chinh da luu |
| Dieu kien truoc | Nguoi dung da mo ung dung, file data.json ton tai |
| Dieu kien sau | Danh sach phim tat duoc hien thi day du |

**Luong su kien chinh:**
1. Nguoi dung mo ung dung tren trinh duyet.
2. He thong tai du lieu tu `data.json`.
3. He thong tai phim tat tuy chinh tu `localStorage`.
4. He thong hien thi toan bo phim tat duoi dang the (card), moi the gom: ten phan mem, mo ta chuc nang, to hop phim, he dieu hanh.
5. He thong hien thi so luong phim tat dang duoc hien thi.

**Luong su kien thay the:**
- **A1 — data.json khong tai duoc:** He thong hien thi danh sach rong, chi hien thi phim tat tu localStorage (neu co).

---

#### UC-02: Tim kiem phim tat

| Truong | Noi dung |
|---|---|
| Ma use-case | UC-02 |
| Ten use-case | Tim kiem phim tat |
| Tac nhan chinh | Lap trinh vien |
| Mo ta | Nguoi dung nhap tu khoa hoac chon filter de tim kiem phim tat phu hop |
| Dieu kien truoc | Danh sach phim tat da duoc tai (UC-01 hoan thanh) |
| Dieu kien sau | Danh sach phim tat duoc loc va hien thi phu hop voi dieu kien tim kiem |

**Luong su kien chinh:**
1. Nguoi dung nhap tu khoa vao o tim kiem.
2. He thong tu dong loc danh sach sau 200ms (debounce) theo: ten chuc nang, to hop phim, ten phan mem.
3. He thong hien thi danh sach ket qua va cap nhat so luong.
4. (Tuy chon) Nguoi dung chon filter phan mem va/hoac he dieu hanh.
5. He thong ap dung them dieu kien loc, cap nhat ket qua.

**Luong su kien thay the:**
- **A1 — Khong tim thay ket qua:** He thong hien thi thong bao "Khong tim thay phim tat nao phu hop" va nut "Them phim tat cua ban".
- **A2 — Nguoi dung xoa het tu khoa:** He thong hien thi lai toan bo danh sach.

---

#### UC-03: Them phim tat tuy chinh

| Truong | Noi dung |
|---|---|
| Ma use-case | UC-03 |
| Ten use-case | Them phim tat tuy chinh |
| Tac nhan chinh | Lap trinh vien |
| Mo ta | Nguoi dung them phim tat ca nhan chua co trong danh sach mac dinh |
| Dieu kien truoc | Nguoi dung da mo ung dung |
| Dieu kien sau | Phim tat moi duoc luu vao localStorage va hien thi trong danh sach voi nhan "Tuy chinh" |

**Luong su kien chinh:**
1. Nguoi dung nhan nut "+" (goc duoi phai).
2. He thong hien thi form nhap lieu voi cac truong: Phan mem (*), Chuc nang (*), To hop phim (*), He dieu hanh.
3. Nguoi dung dien day du thong tin va nhan "Luu phim tat".
4. He thong kiem tra trung lap: so sanh (phan mem + to hop phim) voi toan bo danh sach hien tai (khong phan biet hoa thuong).
5. Khong trung lap: He thong luu vao localStorage, cap nhat danh sach, dong form.

**Luong su kien thay the:**
- **A1 — Trung lap phim tat:** He thong hien thi loi "Phim tat nay da ton tai trong danh sach!", giu form de nguoi dung chinh sua.
- **A2 — Bo trong truong bat buoc:** He thong ngan submit, hien thi thong bao yeu cau dien day du.
- **A3 — Nguoi dung nhan Huy hoac Esc:** He thong dong form, khong luu du lieu.

---

## 3. Cac yeu cau phi chuc nang

### 3.1 Cac yeu cau ve hieu nang

- **Tim kiem theo thoi gian thuc:** Ket qua tim kiem cap nhat sau toi da 200ms ke tu khi nguoi dung ngung go (co su dung ky thuat debounce).
- **Tai du lieu nhanh:** File `data.json` (~8KB voi 50 ban ghi) duoc tai mot lan khi khoi dong, khong co request lap lai.
- **Hieu nang loc:** Thao tac loc va hien thi tren bo du lieu <=500 ban ghi phai hoan thanh trong vong 100ms tren trinh duyet hien dai.

---

### 3.2 Yeu cau ve bao mat

- **Khong luu du lieu nhay cam:** Ung dung chi luu to hop phim va mo ta chuc nang, khong thu thap bat ky thong tin ca nhan nao.
- **Du lieu tuy chinh luu cuc bo:** Phim tat tuy chinh duoc luu vao `localStorage` cua trinh duyet, khong gui len bat ky server nao.
- **Chong XSS co ban:** Noi dung nguoi dung nhap (ten phan mem, chuc nang) duoc chen vao DOM thong qua `innerHTML` co sanitize hoac chuyen sang `textContent` de tranh injection.

---

### 3.3 Yeu cau ve giao dien

- **Ngon ngu hien thi:** Tieng Viet la ngon ngu chinh; thuat ngu ky thuat dung tieng Anh.
- **Giao dien dark mode:** Nen toi (#0f1117), chu mau sang, tuong phan ro rang, phu hop moi truong lam viec ban dem cua lap trinh vien.
- **Responsive:** Giao dien hien thi dung tren ca man hinh may tinh (>= 768px) va thiet bi di dong (< 600px). Tren di dong, the phim tat xep 1 cot, thanh tim kiem xep doc.
- **Hien thi phim tat truc quan:** To hop phim duoc hien thi duoi dang "key badge" (phong cach phim ban phim vat ly), giup nguoi dung de nhan dang.
- **Phan hoi tuc thi:** Cac nuoc hover, focus, active tren nut va the co hieu ung chuyen doi (transition) ro rang.

---

### 3.4 Rang buoc

- **Cong nghe:** Chi su dung HTML5, CSS3, JavaScript (ES6+) thuan tuy — khong dung framework hay thu vien ngoai.
- **Luu tru:** Du lieu tuy chinh luu bang `localStorage`; du lieu se mat neu nguoi dung xoa cache trinh duyet.
- **Khong co backend:** Ung dung la frontend-only, khong co server, khong co co so du lieu.
- **Trinh duyet ho tro:** Cac trinh duyet hien dai (Chrome >= 90, Firefox >= 88, Edge >= 90) ho tro day du ES6+ va localStorage API.
- **Gioi han du lieu:** `data.json` chua toi da 200 ban ghi de dam bao hieu nang loc phia client on dinh. Du lieu tuy chinh khong gioi han so luong (phu thuoc gioi han localStorage ~5MB cua trinh duyet).
