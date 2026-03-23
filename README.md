# Moon Coffee

Moon Coffee la du an fullstack mo phong quy trinh van hanh cua mot ung dung ban ca phe tren mobile, bao gom ung dung React Native cho nguoi dung va trang quan tri, cung backend REST API su dung Express va MongoDB.

Tai lieu nay duoc viet lai theo huong ngan gon, ro rang va phu hop de demo, ban giao hoac tiep tuc phat trien.

## Tong quan

- `mobile/`: ung dung React Native su dung Expo va TypeScript
- `backend/`: REST API su dung Node.js, Express va MongoDB
- `docs/`: tai lieu phan tich, schema va mo ta nghiep vu

## Pham vi chuc nang

### Nguoi dung

- Dang ky, dang nhap va quan ly thong tin ca nhan
- Xem danh sach san pham va chi tiet tung mon
- Tim kiem san pham
- Them san pham vao gio hang
- Dat hang va theo doi lich su don hang

### Quan tri vien

- Dang nhap bang tai khoan admin
- Xem dashboard thong ke
- Them, cap nhat va xoa san pham
- Quan ly danh sach don hang
- Cap nhat trang thai don hang

## Cong nghe su dung

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
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Cau truc du an

```text
moon-coffee-project/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- scripts/
|   |   `-- utils/
|   `-- package.json
|-- mobile/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- navigation/
|   |   |-- screens/
|   |   |-- services/
|   |   |-- theme/
|   |   `-- types/
|   `-- package.json
|-- docs/
`-- README.md
```

## Cai dat va khoi dong

### 1. Chay backend

```bash
cd backend
npm install
```

Tao file `.env` trong thu muc `backend/` voi noi dung tham khao:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/moon-coffee
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d
```

Khoi tao du lieu mau:

```bash
npm run seed
```

Chay server development:

```bash
npm run dev
```

Sau khi khoi tao du lieu, tai khoan admin mac dinh:

- Email: `admin@mooncoffee.vn`
- Password: `123456`

### 2. Chay mobile app

```bash
cd mobile
npm install
```

Tao file `.env` trong thu muc `mobile/`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api
```

Vi du:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```

Khoi dong ung dung:

```bash
npx expo start
```

Neu test bang thiet bi that, hay dam bao dien thoai va may tinh cung mang noi bo.

## API chinh

### Xac thuc

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`

### San pham

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Don hang

- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders`
- `PATCH /api/orders/:id/status`

### Dashboard

- `GET /api/dashboard/stats`

## Quy trinh demo de xuat

1. Dang ky hoac dang nhap tai khoan nguoi dung
2. Xem danh sach san pham va tim kiem mon
3. Them san pham vao gio hang
4. Dat hang
5. Kiem tra lich su don hang
6. Dang nhap bang tai khoan admin
7. Quan ly san pham va cap nhat trang thai don hang
8. Mo dashboard de theo doi so lieu tong quan

## Dinh huong mo rong

- Tich hop thanh toan truc tuyen
- Bo sung danh muc, voucher va chuong trinh khuyen mai
- Ho tro upload hinh anh san pham
- Them thong bao day va cap nhat don hang theo thoi gian thuc
- Bo sung bo loc va tim kiem nang cao

## Luu y

- Du an phu hop cho muc dich hoc tap, demo do an va phat trien tiep theo huong thuong mai
- Truoc khi demo tren thiet bi that, can kiem tra lai gia tri `EXPO_PUBLIC_API_URL`
- Lenh `npm run seed` se tao lai du lieu mau lien quan den san pham va tai khoan admin
