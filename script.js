// Hàm điều hướng chính để chuyển đổi giữa các màn hình
function navigateTo(pageName) {
    // 1. Ẩn tất cả các trang
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    // 2. Hiện trang đích
    const targetPage = document.getElementById('page-' + pageName);
    if (targetPage) targetPage.classList.add('active');

    // 3. Cập nhật nút trên Header tùy theo trang
    renderHeader(pageName);
}

function renderHeader(pageName) {
    const headerRight = document.getElementById('header-right');
    
    if (pageName === 'student-login') {
        headerRight.innerHTML = `<button class="btn-outline-white" onclick="navigateTo('admin-login')">Admin UI</button>`;
    } else if (pageName === 'admin-login') {
        headerRight.innerHTML = `<button class="btn-outline-white" onclick="navigateTo('student-login')">Student UI</button>`;
    } else {
        headerRight.innerHTML = `<button class="btn-outline-white" onclick="navigateTo('student-login')">Log out</button>`;
    }
}

// Khởi chạy khi web load xong
function main() {
    navigateTo('student-login');
}

// Thêm CSS cho nút trắng trên header
const style = document.createElement('style');
style.innerHTML = `
    .btn-outline-white {
        background: white; color: var(--ptit-red); border: none;
        padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;
    }
`;
document.head.appendChild(style);

window.onload = main;