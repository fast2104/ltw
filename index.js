const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Để lấy dữ liệu từ form
app.use(cookieParser());
app.use(session({
    secret: 'my-super-secret-key', // Khóa bí mật cho session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set false cho HTTP (chạy localhost), true nếu dùng HTTPS
}));

// Route 1: GET / (Trang chủ)
app.get('/', (req, res) => {
    const theme = req.cookies.theme || 'light'; // Lấy theme từ cookie, mặc định là light
    const bgColor = theme === 'dark' ? '#333' : '#fff';
    const color = theme === 'dark' ? '#fff' : '#000';

    res.send(`
        <html style="background-color: ${bgColor}; color: ${color}; font-family: sans-serif;">
        <head><title>Trang chủ</title></head>
        <body>
            <h1>Chào mừng đến với Ứng dụng Thực hành</h1>
            <p>Theme hiện tại đang lưu trong Cookie: <strong>${theme}</strong></p>
            <ul>
                <li><a href="/set-theme/light" style="color: ${color}">Chọn theme Light</a></li>
                <li><a href="/set-theme/dark" style="color: ${color}">Chọn theme Dark</a></li>
                <li><a href="/login" style="color: ${color}">Trang Đăng nhập</a></li>
                <li><a href="/profile" style="color: ${color}">Trang cá nhân (Profile)</a></li>
            </ul>
        </body>
        </html>
    `);
});

// Route 2: GET /set-theme/:theme (Cài đặt theme)
app.get('/set-theme/:theme', (req, res) => {
    const { theme } = req.params;
    // Kiểm tra tính hợp lệ
    if (theme === 'light' || theme === 'dark') {
        // Lưu theme vào cookie, sống 7 ngày
        res.cookie('theme', theme, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    }
    // Redirect về trang chủ để thấy thay đổi
    res.redirect('/');
});

// Route 3: GET /login (Hiển thị trang đăng nhập)
app.get('/login', (req, res) => {
    // Nếu đã đăng nhập, chuyển hướng sang profile
    if (req.session.username) {
        return res.redirect('/profile');
    }
    res.send(`
        <html>
        <head><title>Đăng nhập</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
            <h2>Hệ thống Đăng nhập (Mô phỏng)</h2>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Nhập username của bạn..." required />
                <button type="submit">Đăng nhập</button>
            </form>
            <p><a href="/">🔙 Quay lại Trang chủ</a></p>
        </body>
        </html>
    `);
});

// Route 4: POST /login (Xử lý form đăng nhập)
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        // Lưu thông tin vào session
        req.session.username = username;
        req.session.loginTime = new Date().toLocaleString('vi-VN');
        req.session.profileViews = 0; // Khởi tạo bộ đếm
        res.redirect('/profile');
    } else {
        res.send('Vui lòng nhập đầy đủ username. <a href="/login">Thử lại</a>');
    }
});

// Route 5: GET /profile (Trang cá nhân, cần login)
app.get('/profile', (req, res) => {
    // Kiểm tra đăng nhập
    if (!req.session.username) {
        return res.status(401).send(`
            <h3 style="color:red;">Bạn chưa đăng nhập!</h3>
            <p>Vui lòng <a href="/login">đăng nhập</a> để truy cập trang này.</p>
        `);
    }

    // Tăng bộ đếm truy cập trong session
    req.session.profileViews += 1;

    res.send(`
        <html>
        <head><title>Trang cá nhân</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
            <h2>Thông tin cá nhân</h2>
            <p><strong> Username:</strong> ${req.session.username}</p>
            <p><strong> Thời gian đăng nhập:</strong> ${req.session.loginTime}</p>
            <p><strong> Số lần truy cập trang này (trong phiên):</strong> ${req.session.profileViews}</p>
            
            <hr />
            <p><a href="/"> Quay lại Trang chủ</a></p>
            <p><a href="/logout" style="color: red;"> Đăng xuất</a></p>
        </body>
        </html>
    `);
});

// Route 6: GET /logout (Đăng xuất)
app.get('/logout', (req, res) => {
    // Xóa session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Có lỗi khi đăng xuất.');
        }
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`App đang chạy tại: http://localhost:${port}`);
});
