# Moon Coffee - Fullstack React Native Project

## 1) Kiến trúc dự án

```text
moon-coffee-project/
├── backend/         # REST API với Express + MongoDB + JWT
├── mobile/          # Ứng dụng React Native (Expo + TypeScript)
├── docs/            # Tài liệu phân tích, schema DB, API, luồng màn hình
└── README.md
```

## 2) Tính năng chính

### User
- Welcome / Login / Sign up
- Xem danh sách coffee
- Xem chi tiết sản phẩm
- Thêm vào giỏ hàng
- Checkout
- Xem lịch sử đơn hàng
- Xem hồ sơ cá nhân

### Admin
- Đăng nhập bằng tài khoản admin
- Xem dashboard thống kê
- Thêm / sửa / xoá sản phẩm
- Quản lý trạng thái đơn hàng

## 3) Công nghệ

### Mobile
- Expo
- React Native
- TypeScript
- React Navigation
- Axios
- AsyncStorage

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs

## 4) Tài khoản mặc định sau khi seed

### Admin
- Email: `admin@mooncoffee.vn`
- Password: `123456`

## 5) Chạy backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

## 6) Chạy mobile

```bash
cd mobile
cp .env.example .env
npm install
npx expo start
```

> Trong file `.env` của mobile, sửa `EXPO_PUBLIC_API_URL` thành IP máy đang chạy backend.
> Ví dụ: `http://192.168.1.10:5000/api`

## 7) Chạy nhanh với MongoDB local

Cấu hình trong `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/moon-coffee
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d
```

## 8) API chính

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders` (admin)
- `PATCH /api/orders/:id/status` (admin)
- `GET /api/dashboard/stats` (admin)

## 9) Gợi ý demo cho bài bảo vệ

1. Đăng ký user mới
2. Xem menu coffee
3. Thêm sản phẩm vào cart
4. Checkout
5. Đăng xuất
6. Đăng nhập admin
7. Thêm sản phẩm mới
8. Đổi trạng thái đơn hàng
9. Mở MongoDB/Compass để chứng minh dữ liệu từ database

## 10) Ghi chú

- Dự án này được dựng theo đúng hướng fullstack để bạn tiếp tục phát triển thêm.
- Mình đã ưu tiên kiến trúc rõ ràng, dễ học và dễ thuyết trình.
- Bạn có thể nâng cấp thêm:
  - Thanh toán mô phỏng VNPay / MoMo
  - Tìm kiếm nâng cao
  - Chat
  - Mã giảm giá
  - Upload ảnh sản phẩm thật
  - Push notification
